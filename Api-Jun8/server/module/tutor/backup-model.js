const mongoose = require('mongoose');

exports.User = schema => {
  schema.add({
    username: {
      type: String,
      index: true
    },
    subjectIds: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],
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
    issueDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },
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
    zipCode: {
      type: String,
      default: ''
    },
    idYoutube: {
      type: String
    },
    country: {
      type: mongoose.Schema.Types.Mixed
    },
    featured: {
      type: Boolean,
      default: false
    },
    education: [
      {
        title: String,
        description: String,
        fromYear: String,
        toYear: String,
        verified: Boolean,
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Media'
        }
      }
    ],
    experience: [
      {
        title: String,
        description: String,
        fromYear: String,
        toYear: String,
        verified: Boolean,
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Media'
        }
      }
    ],
    certification: [
      {
        title: String,
        description: String,
        fromYear: String,
        toYear: String,
        verified: Boolean,
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Media'
        }
      }
    ],
    isZoomAccount: {
      type: Boolean,
      default: false
    },
    zoomAccountInfo: {
      type: mongoose.Schema.Types.Mixed
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

  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });
};
