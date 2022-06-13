/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Course'
    },
    // tutor id
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: String
    },
    progressValue: {
      type: String
    },
    watchedLecture: [{ type: String }],
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
schema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
