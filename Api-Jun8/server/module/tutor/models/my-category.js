const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    originalCategoryId: {
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
