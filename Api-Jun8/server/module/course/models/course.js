/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    name: {
      type: String,
      default: ''
    },
    alias: {
      type: String,
      index: true
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Category'
      }
    ],
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    isOpen: {
      type: Boolean,
      default: true
    },

    price: {
      type: Number,
      default: 0
    },
    maximumStrength: {
      type: Number,
      default: 0
    },

    mediaIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Media'
      }
    ],
    mainImageId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    featured: {
      type: Boolean,
      default: false
    },
    isFree: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    gradeIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Grade'
      }
    ],
    subjectIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Subject'
      }
    ],
    topicIds: [
      {
        type: Schema.Types.ObjectId,
        index: true,
        ref: 'Topic'
      }
    ]
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

schema.virtual('tutor', {
  ref: 'User',
  localField: 'tutorId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('categories', {
  ref: 'Category',
  localField: 'categoryIds',
  foreignField: '_id',
  justOne: false
});
schema.virtual('media', {
  ref: 'Media',
  localField: 'mediaIds',
  foreignField: '_id',
  justOne: false
});
schema.virtual('mainImage', {
  ref: 'Media',
  localField: 'mainImageId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('coupon', {
  ref: 'Coupon',
  localField: 'couponId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('grades', {
  ref: 'Grade',
  localField: 'gradeIds',
  foreignField: '_id',
  justOne: false
});

schema.virtual('topics', {
  ref: 'Topic',
  localField: 'topicIds',
  foreignField: '_id',
  justOne: false
});

schema.virtual('subjects', {
  ref: 'Subject',
  localField: 'subjectIds',
  foreignField: '_id',
  justOne: false
});

module.exports = schema;
