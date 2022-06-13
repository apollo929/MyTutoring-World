const Schema = require('mongoose').Schema;

const schema = new Schema({
  source: {
    type: String,
    index: true
  },
  target: {
    type: String,
    index: true
  },
  rate: {
    type: Number,
    default: 1
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  restrict: true,
  minimize: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = schema;
