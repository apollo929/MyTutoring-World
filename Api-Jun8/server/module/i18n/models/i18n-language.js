const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    key: { type: String, required: true, index: true },
    name: { type: String },
    flag: { type: String },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    jsonId: { type: Schema.Types.ObjectId },
    countryCode: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    restrict: true,
    minimize: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

module.exports = schema;
