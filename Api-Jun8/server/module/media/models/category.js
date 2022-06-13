const Schema = require('mongoose').Schema;

const schema = new Schema({
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
    type: Number
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
