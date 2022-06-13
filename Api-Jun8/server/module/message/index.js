exports.model = {
  Message: require('./models/message'),
  Conversation: require('./models/conversation'),
  ConversationUserMeta: require('./models/conversation-user-meta')
};

exports.router = (router) => {
  require('./routes/message.route')(router);
  require('./routes/conversation.route')(router);
};

exports.services = { };
