/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    webinarId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Webinar'
    },
    slotId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Schedule'
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Transaction'
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'MySubject'
    },
    topicId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'MyTopic'
    },
    startTime: {
      type: Date
    },
    toTime: {
      type: Date
    },
    status: {
      type: String,
      index: true,
      enum: ['booked', 'pending', 'progressing', 'completed', 'canceled', 'not-start'],
      default: 'booked'
    },
    type: {
      type: String,
      index: true,
      enum: ['booking', 'gift'],
      default: 'booking'
    },
    targetType: {
      type: String,
      enum: ['webinar', 'subject', 'topic'],
      default: 'webinar'
    },
    visible: {
      type: Boolean,
      default: true
    },
    paid: {
      type: Boolean,
      default: false
    },
    isFree: {
      type: Boolean,
      default: false
    },
    note: {
      type: String
    },
    cancelBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelReason: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      index: true,
      uppercase: true
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
    recordings: {
      shareUrl: {
        type: String,
        default: ''
      },
      file: {
        type: Schema.Types.Mixed,
        default: null
      },
      password: {
        type: String,
        default: ''
      }
    },
    meetingId: {
      type: String,
      default: ''
    },
    meetingEnd: {
      type: Boolean,
      default: false
    },
    meetingEndAt: {
      type: Date
    },
    meetingStart: {
      type: Boolean,
      default: false
    },
    meetingStartAt: {
      type: Date
    },
    dataMeeting: {
      type: Schema.Types.Mixed,
      default: null
    },
    description: { type: String },
    documentIds: [{ type: Schema.Types.ObjectId }],
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    studentReview: {
      type: Schema.Types.Mixed,
      default: null
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'MyCategory'
    },
    displayToTime: { type: Date },
    displayStartTime: { type: Date }
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

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('tutor', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('webinar', {
  ref: 'Webinar',
  localField: 'webinarId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('transaction', {
  ref: 'Transaction',
  localField: 'transactionId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('subject', {
  ref: 'MySubject',
  localField: 'subjectId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('category', {
  ref: 'MyCategory',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('documents', {
  ref: 'Media',
  localField: 'documentIds',
  foreignField: '_id',
  justOne: false
});

schema.virtual('topic', {
  ref: 'MyTopic',
  localField: 'topicId',
  foreignField: '_id',
  justOne: true
});

schema.pre('save', function beforeSave(next) {
  if (!this.code) {
    this.code = Helper.String.randomString(5);
  }
  next();
});

module.exports = schema;
