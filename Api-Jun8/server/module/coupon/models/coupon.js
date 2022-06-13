const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['percent', 'money'],
      default: 'percent'
    },
    value: {
      type: Number,
      default: 0
    },
    webinarId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Webinar'
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    expiredDate: {
      type: Date,
      default: Date.now()
    },
    startTime: {
      type: Date
    },
    targetType: {
      type: String,
      default: 'webinar',
      enum: ['webinar', 'subject', 'course']
    },
    limitNumberOfUse: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
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
schema.virtual('tutor', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('webinar', {
  ref: 'Webinar',
  localField: 'webinarId',
  foreignField: '_id',
  justOne: true
});
module.exports = schema;
