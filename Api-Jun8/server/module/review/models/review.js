const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      index: true
    },
    webinarId: {
      type: Schema.Types.ObjectId,
      ref: 'Webinar',
      index: true
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true
    },
    rateTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    rateBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    comment: {
      type: String
    },
    rating: {
      type: Number
    },
    type: {
      type: String,
      default: '',
      index: true
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

schema.virtual('rater', {
  ref: 'User',
  localField: 'rateBy',
  foreignField: '_id',
  justOne: true
});

schema.virtual('tutor', {
  ref: 'User',
  localField: 'rateTo',
  foreignField: '_id',
  justOne: true
});

schema.virtual('webinar', {
  ref: 'Webinar',
  localField: 'webinarId',
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
