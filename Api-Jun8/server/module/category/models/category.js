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
    imageId: {
      type: Schema.Types.ObjectId
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
schema.virtual('image', {
  ref: 'Media',
  localField: 'imageId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
