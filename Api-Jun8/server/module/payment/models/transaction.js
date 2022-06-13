/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    targetType: {
      type: String,
      default: 'webinar',
      enum: ['webinar', 'subject', 'course', 'topic']
    },
    // tutor id
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    type: {
      type: String,
      default: 'booking',
      enum: ['booking', 'gift']
    },
    paid: {
      type: Boolean,
      default: false
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    vat: {
      type: Number,
      default: 0
    },
    couponInfo: {
      type: Schema.Types.Mixed,
      default: {
        couponCode: '',
        couponId: '',
        discountAmount: 0,
        discountPrice: 0,
        discountValue: 0,
        type: ''
      }
    },
    couponCode: {
      type: String,
      index: true
    },
    usedCoupon: {
      type: Boolean,
      default: false
    },
    commission: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    completePayout: { type: Boolean, default: false },
    isRefund: { type: Boolean, default: false },
    emailRecipient: {
      type: String,
      default: ''
    },
    idRecipient: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isRemindRecipient: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      index: true,
      uppercase: true
    },
    status: {
      type: String,
      index: true,
      default: 'pending',
      enum: [
        'pending',
        'canceled',
        'processing',
        'completed',
        'pending-refund',
        'approved-refund',
        'refunded',
        'pending-payout',
        'approved-payout',
        'payout'
      ]
    },
    stripeClientSecret: {
      type: String,
      default: ''
    },
    paymentInfo: {
      type: Schema.Types.Mixed,
      default: {}
    },
    applicationFee: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    paymentMode: {
      type: String,
      default: 'card',
      enum: ['test', 'card']
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

schema.pre('save', function beforeSave(next) {
  if (!this.code) {
    this.code = Helper.String.randomString(5);
  }
  next();
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

schema.virtual('course', {
  ref: 'Course',
  localField: 'targetId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
