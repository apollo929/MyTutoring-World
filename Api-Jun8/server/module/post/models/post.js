const Schema = require('mongoose').Schema;

const schema = new Schema({
  title: {
    type: String
  },
  alias: {
    type: String,
    index: true
  },
  content: {
    type: String
  },
  type: {
    type: String,
    default: 'post',
    index: true
  },
  categoryIds: [{
    type: Schema.Types.ObjectId,
    ref: 'PostCategory'
  }],
  ordering: {
    type: Number,
    default: 0
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
  }
});

module.exports = schema;
