const mongoose = require('mongoose');
const crypto = require('crypto');

const authTypes = ['github', 'twitter', 'facebook', 'google'];

exports.model = {
  User() {
    const UserSchema = new mongoose.Schema({
      name: String,
      email: {
        index: true,
        type: String,
        lowercase: true,
        unique: true
      },
      role: {
        type: String,
        default: 'user',
        index: true
      },
      password: {
        type: String
      },
      provider: {
        type: String,
        default: 'local'
      },
      // countryCode: {
      //   type: String,
      //   default: ''
      // },
      // state: {
      //   type: String,
      //   default: ''
      // },
      // city: {
      //   type: String,
      //   default: ''
      // },
      salt: String,
      facebook: {},
      twitter: {},
      google: {},
      github: {},
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }, {
      collection: 'users',
      restrict: true,
      minimize: false,
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    });

    // Public profile information
    UserSchema
      .virtual('profile')
      .get(function getProfile() {
        return {
          name: this.name,
          role: this.role
        };
      });

    // Non-sensitive info we'll be putting in the token
    UserSchema
      .virtual('token')
      .get(function getToken() {
        return {
          _id: this._id,
          role: this.role
        };
      });

    UserSchema.index({
      email: 1
    }, {
      unique: true,
      sparse: true
    });

    const validatePresenceOf = value => value && value.length;

    /**
     * Pre-save hook
     */
    UserSchema
      .pre('save', function beforeSave(next) {
        const now = Date.now();
        this.set('updatedAt', now);

        if (this.isNew) {
          this.set('createdAt', now);
        }

        // Handle new/update passwords
        if (!this.isModified('password')) {
          return next();
        }

        if (!validatePresenceOf(this.password)) {
          if (authTypes.indexOf(this.provider) === -1) {
            return next(new Error('Invalid password'));
          }

          return next();
        }

        // Make salt with a callback
        return this.makeSalt((saltErr, salt) => {
          if (saltErr) {
            return next(saltErr);
          }

          this.salt = salt;
          return this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
            if (encryptErr) {
              return next(encryptErr);
            }
            this.password = hashedPassword;

            return next();
          });
        });
      });

    /**
     * Methods
     */
    UserSchema.methods = {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @param {Function} callback
       * @return {Boolean}
       * @api public
       */
      authenticate(password, callback) {
        if (!callback) {
          return this.password === this.encryptPassword(password);
        }

        return this.encryptPassword(password, (err, pwdGen) => {
          if (err) {
            return callback(err);
          }

          return callback(null, this.password === pwdGen);
        });
      },

      /**
       * Make salt
       *
       * @param {Number} byteSize Optional salt byte size, default to 16
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      makeSalt(size, cb) {
        const defaultByteSize = 16;
        let byteSize = size;
        let callback = cb;
        if (typeof byteSize === 'function') {
          callback = byteSize;
          byteSize = defaultByteSize;
        }

        if (!byteSize) {
          byteSize = defaultByteSize;
        }

        if (!callback) {
          return crypto.randomBytes(byteSize).toString('base64');
        }

        return crypto.randomBytes(byteSize, (err, salt) => {
          if (err) {
            return callback(err);
          }

          return callback(null, salt.toString('base64'));
        });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      encryptPassword(password, callback) {
        if (!password || !this.salt) {
          if (!callback) {
            return null;
          }

          return callback('Missing password or salt');
        }

        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = Buffer.from(this.salt).toString('base64');

        if (!callback) {
          return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1')
            .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
          if (err) {
            return callback(err);
          }

          return callback(null, key.toString('base64'));
        });
      }
    };

    return UserSchema;
  }
};
