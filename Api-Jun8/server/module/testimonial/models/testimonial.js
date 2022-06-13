const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    name: {
      type: String
    },
    title: {
      type: String
    },
    description: { type: String },
    idYoutube: { type: String },
    type: { type: String },
    imageId: {
      type: Schema.Types.ObjectId
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
