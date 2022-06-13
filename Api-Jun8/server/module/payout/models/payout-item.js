const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    requestId: {
      type: Schema.Types.ObjectId
    },
    itemType: {
      type: String,
      index: true,
      default: 'appointment'
    },
    itemId: {
      type: Schema.Types.ObjectId
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    status: {
      type: String,
      index: true,
      default: 'pending'
    },
    total: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  {
    minimize: false,
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
schema.virtual('tutor', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('transaction', {
  ref: 'Transaction',
  localField: 'itemId',
  foreignField: '_id',
  justOne: true
});
module.exports = schema;
