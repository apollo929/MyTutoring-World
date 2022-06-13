/* eslint no-param-reassign: 0 */
const Joi = require('joi');
const _ = require('lodash');

const validateSchema = Joi.object().keys({
  type: Joi.string().allow(['private']).optional().default('private'),
  recipientId: Joi.string().allow([null, '']).optional()
});

/**
 * Create a get room if provided
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if (req.user._id.toString() === validate.value.recipientId) {
      return next(
        PopulateResponse.error({
          message: 'Cannot create conversation yourself!'
        })
      );
    }

    const query = {};
    if (validate.value.type === 'private') {
      query.memberIds = {
        $all: [req.user._id, Helper.App.toObjectId(validate.value.recipientId)]
      };
    }

    let conversation = await DB.Conversation.findOne(query);
    if (conversation) {
      res.locals.conversation = conversation;
      return next();
    }

    conversation = new DB.Conversation(validate.value);
    conversation.memberIds = [req.user._id, Helper.App.toObjectId(validate.value.recipientId)];

    await conversation.save();
    res.locals.conversation = conversation;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = {
      memberIds: { $in: [req.user._id] },
      lastMessageId: { $ne: null }
    };
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Conversation.countDocuments(query);
    const items = await DB.Conversation.find(query)
      .populate({ path: 'members', select: '_id name username avatar avatarUrl' })
      .populate({
        path: 'lastMessage'
      })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    const senderIds = items.filter(item => item.lastMessage).map(message => message.lastMessage.senderId);
    const senders = !senderIds.length
      ? []
      : await DB.User.find({
          _id: { $in: senderIds }
        });
    const dataConversation = await Promise.all(
      items.map(async item => {
        const data = item.toObject();
        data.members = (item.members || []).map(member => member.getPublicProfile());

        // if (item.lastMessage) {
        //   const sender = _.find(senders, s => s._id.toString() === item.lastMessage.senderId.toString());
        //   data.lastMessage.sender = sender ? sender.getPublicProfile() : null;
        // }

        const userMeta = await DB.ConversationUserMeta.findOne({ userId: req.user._id, conversationId: item._id });
        if (userMeta) {
          data.userMeta = userMeta;
        }
        return data;
      })
    );
    res.locals.list = {
      count,
      items: dataConversation
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.mute = async (req, res, next) => {
  try {
    await DB.Conversation.update(
      {
        _id: req.params.conversationId
      },
      {
        $addToSet: {
          muted: req.user._id
        }
      }
    );

    res.locals.mute = { succes: true };
    next();
  } catch (e) {
    next(e);
  }
};

exports.unmute = async (req, res, next) => {
  try {
    await DB.Conversation.update(
      {
        _id: req.params.conversationId
      },
      {
        $$pull: {
          muted: req.user._id
        }
      }
    );

    res.locals.unmute = { succes: true };
    next();
  } catch (e) {
    next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return next(
        PopulateResponse.error({
          message: 'Missing params!'
        })
      );
    }
    const conversation = await DB.Conversation.findOne({ _id: id })
      .populate({ path: 'members', select: '_id name username avatar avatarUrl' })
      .populate({
        path: 'lastMessage'
      });
    if (!conversation) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    const data = conversation.toObject();
    data.members = (conversation.members || []).map(member => member.getPublicProfile());
    const userMeta = await DB.ConversationUserMeta.findOne({ userId: req.user._id, conversationId: conversation._id });
    if (userMeta) {
      data.userMeta = userMeta;
    }
    res.locals.conversation = data;
    return next();
  } catch (e) {
    return next(e);
  }
};
