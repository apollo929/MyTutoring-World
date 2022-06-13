const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    tutorId: {
      type: Schema.Types.ObjectId
    },
    userId: { type: Schema.Types.ObjectId },
    webinarId: { type: Schema.Types.ObjectId },
    courseId: { type: Schema.Types.ObjectId },
    type: { type: String },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt'
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
schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('webinar', {
  ref: 'Webinar',
  localField: 'webinarId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true
});
module.exports = schema;
