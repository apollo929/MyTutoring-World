/* eslint prefer-arrow-callback: 0 */
const _ = require('lodash');
const mongoose = require('mongoose');
exports.User = schema => {
  schema.add({
    avatar: { type: String, default: '' },
    emailVerifiedToken: {
      type: String,
      index: true
    },
    type: {
      type: String,
      default: 'user',
      index: true
    },
    passwordResetToken: {
      type: String,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    // number with national format
    phoneNumber: {
      type: String,
      default: '',
      index: true
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    address: { type: String, default: '' },
    notificationSettings: {
      type: Boolean,
      default: true
    },
    paypalEmailId: {
      type: String,
      lowercase: true,
      default: ''
    },
    timezone: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: ''
    },
    country: {
      type: mongoose.Schema.Types.Mixed
    },
    countryCode: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    zipCode: {
      type: String,
      default: ''
    }
  });

  schema.method('toJSON', function toJSON() {
    const user = this.toObject();
    // TODO - convert avatar url from here
    user.avatarUrl = DB.User.getAvatarUrl(user.avatar);
    return _.omit(user, ['password', 'emailVerifiedToken', 'passwordResetToken', 'salt', 'avatar']);
  });

  schema.virtual('avatarUrl').get(function avatarUrl() {
    return DB.User.getAvatarUrl(this.avatar);
  });

  /**
   * get user public profile
   * @return {Object} user data
   */
  schema.method('getPublicProfile', function getPublicProfile(toJSON = false) {
    const user = toJSON ? this.toJSON() : this.toObject();
    user.avatarUrl = DB.User.getAvatarUrl(user.avatarUrl);
    return _.omit(user, ['password', 'emailVerifiedToken', 'passwordResetToken', 'salt']);
  });

  schema.static('getAvatarUrl', function getAvatarUrl(filePath) {
    if (Helper.String.isUrl(filePath)) {
      return filePath;
    }

    const newFilePath = filePath || 'public/assets/default-avatar.jpg';
    return Helper.App.getPublicFileUrl(newFilePath);
  });
};
