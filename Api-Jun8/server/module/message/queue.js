const Queue = require('../../kernel/services/queue');
const _ = require('lodash');

const messageQ = Queue.create('message');

messageQ.process(async (job, done) => {
  try {
    const message = job.data.message;
    // notify to presence channel group
    if (message.fileId) {
      const file = await DB.Media.findOne({ _id: message.fileId });
      if (file) {
        message.file = file.toJSON();
      }
    }

    const pnData = message;
    // send message to user in the channel
    const conversation = await DB.Conversation.findOne({ _id: message.conversationId });
    const mute = conversation.mute || [];
    if (!conversation) {
      return done();
    }

    let userIds = [];
    if (conversation.type === 'private') {
      userIds = conversation.memberIds
        .filter(memberId => memberId.toString() !== message.senderId.toString())
        .filter(memberId => _.findIndex(mute, u => u.toString() === memberId.toString()) === -1);
    }
    const sender = await DB.User.findOne({ _id: message.senderId });
    if (userIds.length) {
      // let heading = 'New message';
      pnData.sender = sender.getPublicProfile();
      // if (conversation.type === 'private') {
      // heading = sender.name;
      // }

      pnData.uuid = Helper.String.generateUuid();
      await Promise.all(userIds.map(userId => Service.Socket.emitToUsers(userId, 'new_message', pnData)));
      await DB.ConversationUserMeta.update(
        {
          conversationId: conversation._id,
          userId: sender._id
        },
        {
          $set: {
            unreadMessage: 0
          }
        }
      );
      // TODO - unblock for PN
      // const text = conversation.type === 'private' ? message.text : `${sender.username}: ${message.text}`;
      // const contents = Helper.String.truncate(text, 50);
      // Service.Pushnotification.push(userIds, heading, contents, pnData);
      // await Service.Pusher.emitToChannel(message.conversationId, 'new_message', pnData);
      // await Promise.all(userIds.map(userId => Service.Pusher.trigger(`private-${userId}`, 'new_message', pnData)));
    }

    // update content to conversation
    conversation.lastMessageId = message._id;
    conversation.lastText = message.text;
    conversation.updatedAt = message.createdAt;
    await conversation.save();

    // update unread message metadata
    await Promise.all(
      userIds.map(async userId => {
        await DB.ConversationUserMeta.update(
          {
            conversationId: conversation._id,
            userId
          },
          {
            $set: {
              conversationId: conversation._id,
              userId
            },
            $inc: { unreadMessage: 1 }
          },
          {
            upsert: true
          }
        );
      })
    );

    const receiverId = conversation.memberIds.find(id => id.toString() !== sender._id.toString());
    const receiver = receiverId ? await DB.User.findOne({ _id: receiverId }) : null;
    if (receiver && sender) {
      const userOnConnectSocket = await Service.Socket.getUserConnecting(receiver._id);
      const userMeta = await DB.ConversationUserMeta.findOne({ conversationId: conversation._id, userId: receiver._id });
      if (userMeta && !userOnConnectSocket.length && !userMeta.remindNewMessage) {
        const subject = 'New Message';

        if (receiver && receiver.notificationSettings) {
          await Service.Mailer.send('message/new-message.html', receiver.email, {
            subject,
            user: receiver.toObject(),
            message: message,
            sender: sender.toObject()
          });
          await DB.ConversationUserMeta.update(
            { conversationId: conversation._id, userId: receiver._id },
            {
              $set: {
                remindNewMessage: true
              }
            }
          );
        }
      }
    }
  } catch (e) {
    // TODO - log error here
  }

  return done();
});

exports.notifyAndUpdateRelationData = message => {
  const data = message.toObject ? message.toObject() : message;
  messageQ.createJob({ message: data }).save();
};
