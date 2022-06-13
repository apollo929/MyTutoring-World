const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    originalTopicId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    name: {
      type: String
    },
    alias: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      default: 0
    },
    mySubjectId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'MySubject'
    },
    myCategoryId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'MyCategory'
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

module.exports = schema;
