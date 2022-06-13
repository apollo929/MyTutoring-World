const Joi = require('joi');
const Queue = require('../queue');

/**
 * Create a new media message
 */
exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      text: Joi.string().allow([null, '']).optional(),
      fileId: Joi.string().allow([null, '']).optional(),
      conversationId: Joi.string().required(),
      type: Joi.string().allow(['text', 'file']).required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const conversation = await DB.Conversation.findOne({ _id: validate.value.conversationId });
    if (!conversation) {
      return PopulateResponse.notFound({
        message: 'Conversation not found'
      });
    }

    const message = new DB.Message(
      Object.assign(req.body, {
        senderId: req.user._id,
        read: false
      })
    );
    await message.save();
    Queue.notifyAndUpdateRelationData(message);

    res.locals.create = message;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * get list message
 */
exports.groupMessages = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    // TODO - validate user room
    const query = {};
    if (req.params.conversationId) {
      query.conversationId = req.params.conversationId;
    }

    if (req.query.q) {
      query.text = { $regex: req.query.q.trim(), $options: 'i' };
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Message.count(query);
    const items = await DB.Message.find(query)
      .populate({ path: 'sender', select: '_id name username avatar avatarUrl' })
      .populate('file')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = {
      count,
      items: items.map(item => {
        const data = item.toObject();
        // data.sender = item.sender ? item.sender.getPublicProfile(true) : null;
        data.file = item.file;
        return data;
      })
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.read = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      all: Joi.boolean().optional()
      // conversationId: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const conversationId = req.params.conversationId;
    if (!conversationId) {
      return next(PopulateResponse.error({ message: 'Conversation not found' }));
    }

    const update = validate.value.all
      ? { $set: { unreadMessage: 0, remindNewMessage: false } }
      : { $inc: { unreadMessage: -1 }, $set: { remindNewMessage: false } };
    await DB.ConversationUserMeta.update(
      {
        conversationId: conversationId,
        userId: req.user._id
      },
      update
    );

    res.locals.read = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const message = await DB.Message.findOne({ _id: req.params.messageId });
    if (!message) {
      return next(PopulateResponse.notFound());
    }

    if (req.user.role !== 'admin' && message.senderId.toString() !== req.user._id.toString()) {
      // TODO - check owner of room, etc...
      return next(PopulateResponse.forbidden());
    }

    await message.remove();

    res.locals.remove = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.latest = async (req, res, next) => {
  try {
    const conversations = await DB.Conversation.find({
      memberIds: { $in: [req.user._id] },
      lastMessageId: { $ne: null }
    });
    if (!conversations.length) {
      res.locals.latest = [];
      return next();
    }

    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = {
      conversationId: {
        $in: conversations.map(conversation => conversation._id)
      },
      senderId: {
        $ne: req.user._id
      }
    };
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Message.count(query);
    const items = await DB.Message.find(query)
      .populate('sender')
      .populate('file')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.latest = {
      count,
      items: items.map(item => {
        const data = item.toObject();
        data.sender = item.sender ? item.sender.getPublicProfile(true) : null;
        data.file = item.file;
        return data;
      })
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.sendMessageToAdmin = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      text: Joi.string().allow([null, '']).optional(),
      fileId: Joi.string().allow([null, '']).optional(),
      type: Joi.string().allow(['text', 'file']).required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const admin = await DB.User.findOne({
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    const message = new DB.Message(
      Object.assign(req.body, {
        senderId: req.user._id,
        read: false
      })
    );

    const query = {};
    query.memberIds = {
      $all: [req.user._id, Helper.App.toObjectId(admin._id)]
    };
    let conversation = await DB.Conversation.findOne(query);

    if (!conversation) {
      conversation = new DB.Conversation({ type: 'private', recipientId: admin._id });
      conversation.memberIds = [req.user._id, Helper.App.toObjectId(admin._id)];
      await conversation.save();
    }
    message.conversationId = conversation._id;
    await message.save();
    const receiverId = conversation.memberIds.find(id => id.toString() !== req.user._id.toString());
    const receiver = receiverId ? await DB.User.findOne({ _id: receiverId }) : null;
    const sender = req.user;
    if (receiver) {
      const userOnConnectSocket = await Service.Socket.getUserConnecting(receiver._id);
      const userMeta = await DB.ConversationUserMeta.findOne({ conversationId: conversation._id, userId: receiver._id });
      if (userMeta && !userOnConnectSocket.length && !userMeta.remindNewMessage) {
        const subject = 'New Message';
        if (receiver && receiver.notificationSettings) {
          await Service.Mailer.send('message/new-message.html', receiver.email, {
            subject,
            user: receiver.toObject(),
            message: message.toObject(),
            sender: sender.toObject()
          });
          await DB.ConversationUserMeta.update(
            { conversationId: conversation._id, userId: receiver._id },
            {
              $set: {
                remindNewMessage: true,
                conversationId: conversation._id,
                userId: receiver._id
              }
            }
          );
        }
      }
    }
    Queue.notifyAndUpdateRelationData(message);

    res.locals.sendToAdmin = message;
    return next();
  } catch (e) {
    return next(e);
  }
};
