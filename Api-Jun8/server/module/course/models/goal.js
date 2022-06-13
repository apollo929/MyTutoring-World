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
    name: {
      type: String
    },
    type: {
      type: String,
      enum: ['able_to', 'age', 'pre'],
      default: 'able_to'
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

module.exports = schema;
