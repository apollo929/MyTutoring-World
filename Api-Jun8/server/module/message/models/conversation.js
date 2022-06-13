const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    type: {
      type: String,
      enum: ['private', 'room'],
      index: true
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      index: true
    },
    lastText: {
      type: String
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    name: {
      type: String
    },
    memberIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
      }
    ],
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

schema.virtual('members', {
  ref: 'User',
  localField: 'memberIds',
  foreignField: '_id',
  justOne: false
});

schema.virtual('room', {
  ref: 'Room',
  localField: 'roomId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('lastMessage', {
  ref: 'Message',
  localField: 'lastMessageId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
