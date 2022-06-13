/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'User'
  },
  // tutor id
  userId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'User'
  },
  paid: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  earn: {
    type: Number,
    default: 0
  },
  fee: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
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
});

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('appointment', {
  ref: 'Appointment',
  localField: 'appointmentId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
