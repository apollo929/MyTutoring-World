const Schema = require('mongoose').Schema;

const schema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    index: true
  },
  address: {
    typ: String
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
