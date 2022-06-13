const Schema = require('mongoose').Schema;

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId
  },
  social: {
    type: String // google, facebook etc
  },
  socialInfo: {
    type: Schema.Types.Mixed
  },
  socialId: {
    type: String,
    index: true
  },
  accessToken: {
    type: String
  },
  // for Twitter or another nework
  refreshToken: {
    type: String
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
