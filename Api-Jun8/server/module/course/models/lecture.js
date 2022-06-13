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
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'LectureSection'
    },
    mediaIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Media'
      }
    ],
    mediaInfo: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    ordering: {
      type: Number
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
schema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('tutor', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('media', {
  ref: 'Media',
  localField: 'mediaIds',
  foreignField: '_id',
  justOne: false
});

module.exports = schema;
