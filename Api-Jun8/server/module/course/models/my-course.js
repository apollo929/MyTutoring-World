/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Course'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    name: {
      type: String
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Category'
      }
    ],
    paid: {
      type: Boolean,
      default: false
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
schema.virtual('user', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
