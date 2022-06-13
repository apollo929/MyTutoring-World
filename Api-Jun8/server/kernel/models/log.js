const mongoose = require('mongoose');

exports.model = {
  Log() {
    const LogSchema = new mongoose.Schema({
      path: {
        type: String
      },
      reqQuery: {
        type: mongoose.Schema.Types.Mixed
      },
      reqBody: {
        type: mongoose.Schema.Types.Mixed
      },
      headers: {
        type: mongoose.Schema.Types.Mixed
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId
      },
      level: {
        type: String,
        default: 'error'
      },
      error: {
        type: mongoose.Schema.Types.Mixed
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }, {
      collection: 'logs',
      minimize: false,
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    });

    return LogSchema;
  }
};
