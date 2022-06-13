/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    webinarId: {
      type: Schema.Types.ObjectId,
      ref: 'Webinar'
    },
    // slotId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Schedule'
    // },
    // giver
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    // startTime: {
    //   type: Date
    // },
    // toTime: {
    //   type: Date
    // },
    // appointmentId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Appointment'
    // },
    // meta: {
    //   type: Schema.Types.Mixed,
    //   default: {
    //     sendNotifications: {
    //       before: {
    //         60: false,
    //         480: false
    //       }
    //     }
    //   }
    // },
    emailRecipient: {
      type: String,
      default: ''
    },
    // zoomData: {
    //   type: Schema.Types.Mixed
    // },
    createdAt: {
      type: Date
    },
    updatedAt: {
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
