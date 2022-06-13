/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema({
  tutorId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'User'
  },
  userId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'User'
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'Subject'
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
    default: 'pending'
  },
  visible: {
    type: Boolean,
    default: true
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
          30: false,
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
    }
  },
  meetingId: {
    type: String
  },
  meetingEnd: {
    type: Boolean,
    default: false
  },
  meetingEndAt: {
    type: Date
  },
  isFree: {
    type: Boolean,
    default: false
  },
  paid: {
    type: Boolean,
    default: true
  },
  transactionId: {
    type: Schema.Types.ObjectId
  },
  price: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
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

schema.virtual('subject', {
  ref: 'Subject',
  localField: 'subjectId',
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
