/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    webinarId: {
      type: Schema.Types.ObjectId,
      ref: 'Webinar'
    },
    // tutor id
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    startTime: {
      type: Date
    },
    toTime: {
      type: Date
    },
    displayStartTime: {
      type: Date
    },
    displayToTime: {
      type: Date
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {
        sendNotifications: {
          before: {
            60: false,
            480: false
          }
        }
      }
    },
    zoomData: {
      type: Schema.Types.Mixed
    },
    notifyForTutor: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['scheduled', 'pending', 'progressing', 'completed', 'canceled', 'not-start'],
      default: 'scheduled'
    },
    type: {
      type: String,
      enum: ['webinar', 'subject'],
      default: 'webinar'
    },
    hashWebinar: {
      type: String,
      default: ''
    },
    isFree: {
      type: Boolean,
      default: false
    },
    isDST: {
      type: Boolean,
      default: false
    },
    dtsStartTime: {
      type: Date
    },
    dtsToTime: {
      type: Date
    }
  },
  {
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
  }
);

module.exports = schema;
