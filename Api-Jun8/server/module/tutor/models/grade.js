const Schema = require('mongoose').Schema;

const schema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  alias: {
    type: String,
    index: true
  },
  type: {
    type: String,
    enum: ['high-school', 'middle-school', 'elementary', 'college'],
    default: 'elementary'
  },
  ordering: {
    type: Number,
    index: true
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
    },
    toObject: {
      virtuals: true
    }
  });

module.exports = schema;
