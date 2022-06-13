/* eslint prefer-arrow-callback: 0 */
const moment = require('moment');
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId
    },
    tutorId: {
      type: Schema.Types.ObjectId
    },
    appointmentId: {
      type: Schema.Types.ObjectId
    },
    transactionId: { type: Schema.Types.ObjectId },
    webinarId: { type: Schema.Types.ObjectId },
    subjectId: { type: Schema.Types.ObjectId },
    courseId: { type: Schema.Types.ObjectId },
    targetId: { type: Schema.Types.ObjectId },
    type: {
      type: String,
      default: 'before',
      enum: ['before', 'after']
    },
    targetType: {
      type: String,
      default: '',
      enum: ['webinar', 'course', 'subject']
    },
    amount: {
      type: Number,
      default: 0
    },
    reason: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'pending',
      index: true,
      enum: ['pending', 'approved', 'rejected', 'refunded']
    },
    code: {
      type: String,
      index: true,
      uppercase: true
    },
    rejectReason: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
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

schema.index({ code: 1 }, { unique: true, sparse: true });

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('tutor', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('appointment', {
  ref: 'Appointment',
  localField: 'appointmentId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('transaction', {
  ref: 'Transaction',
  localField: 'transactionId',
  foreignField: '_id',
  justOne: true
});
schema.pre('save', function beforeSave(next) {
  if (!this.code) {
    this.code = `PR${moment().format('YYYYMMDDHHmmssSS')}`;
  }
  next();
});

module.exports = schema;
