const Schema = require('mongoose').Schema;

const schema = new Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  position: {
    type: String,
    default: 'default',
    index: true
  },
  ordering: {
    type: Number,
    default: 0
  },
  mediaId: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  link: {
    type: String
  },
  meta: {
    type: Schema.Types.Mixed
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  toJSON: {
    virtuals: true
  }
});

schema.virtual('media', {
  ref: 'Media',
  localField: 'mediaId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
