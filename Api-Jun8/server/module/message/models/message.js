const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    type: {
      type: String,
      enum: ['text', 'file'],
      default: 'text'
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String
    },
    fileId: {
      type: Schema.Types.ObjectId,
      ref: 'Media'
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

schema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('recipient', {
  ref: 'User',
  localField: 'recipientId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('file', {
  ref: 'Media',
  localField: 'fileId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
