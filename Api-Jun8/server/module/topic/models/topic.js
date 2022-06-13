const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    name: {
      type: String
    },
    alias: {
      type: String,
      index: true
    },
    description: {
      type: String
    },
    ordering: {
      type: Number,
      default: 0
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Category'
      }
    ],
    subjectIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Subject'
      }
    ],
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
schema.virtual('categories', {
  ref: 'Category',
  localField: 'categoryIds',
  foreignField: '_id',
  justOne: false
});

schema.virtual('subjects', {
  ref: 'Subject',
  localField: 'subjectIds',
  foreignField: '_id',
  justOne: false
});

module.exports = schema;
