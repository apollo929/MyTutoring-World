const mongoose = require('mongoose');

exports.User = schema => {
  schema.add({
    username: {
      type: String,
      index: true
    },
    bio: {
      type: String
    },
    certificatedTeacher: {
      type: Boolean,
      deafult: false
    },
    languages: [
      {
        type: String
      }
    ],
    grades: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade'
      }
    ],
    // issueDocument: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Media'
    // },
    // resumeDocument: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Media'
    // },
    // certificationDocument: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Media'
    // },
    rejected: {
      type: Boolean,
      default: true
    },
    rejectReason: {
      type: String
    },
    isHomePage: {
      type: Boolean,
      default: false
    },
    idYoutube: {
      type: String
    },
    featured: {
      type: Boolean,
      default: false
    },
    educationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
      }
    ],
    experienceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
      }
    ],
    certificationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
      }
    ],
    isZoomAccount: {
      type: Boolean,
      default: false
    },
    zoomAccountInfo: {
      type: mongoose.Schema.Types.Mixed
    },
    price1On1Class: {
      type: Number,
      default: 0
    },
    availableTimeRange: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: {
          startTime: '',
          toTime: ''
        },
        index: true
      }
    ],
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        ref: 'Category'
      }
    ],
    completedByLearner: {
      type: Number,
      default: 0
    },
    commissionRate: {
      type: Number,
      default: 0
    },
    introVideoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      default: null
    },
    introYoutubeId: {
      type: String,
      default: null
    },
    subjectIds: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    topicIds: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    pendingApprove: {
      type: Boolean,
      default: true
    },
    accountStripeId: {
      type: String,
      default: ''
    },
    accountStripeType: {
      type: String,
      default: 'standard',
      enum: ['standard', 'express', 'custom']
    },
    stripePayoutsEnabled: {
      type: Boolean,
      default: false
    },
    stripeDetailsSubmitted: {
      type: Boolean,
      default: false
    },
    stripeChargesEnabled: {
      type: Boolean,
      default: false
    }
  });
  schema.virtual('subjects', {
    ref: 'Subject',
    localField: 'subjectIds',
    foreignField: '_id',
    justOne: false
  });
  schema.virtual('gradeItems', {
    ref: 'Grade',
    localField: 'grades',
    foreignField: '_id',
    justOne: false
  });

  schema.virtual('education', {
    ref: 'Certification',
    localField: 'educationIds',
    foreignField: '_id',
    justOne: false
  });

  schema.virtual('experience', {
    ref: 'Certification',
    localField: 'experienceIds',
    foreignField: '_id',
    justOne: false
  });

  schema.virtual('certification', {
    ref: 'Certification',
    localField: 'certificationIds',
    foreignField: '_id',
    justOne: false
  });

  schema.virtual('introVideo', {
    ref: 'Media',
    localField: 'introVideoId',
    foreignField: '_id',
    justOne: true
  });

  schema.virtual('categories', {
    ref: 'Category',
    localField: 'categoryIds',
    foreignField: '_id',
    justOne: false
  });

  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });
};
