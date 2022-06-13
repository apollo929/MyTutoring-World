/* eslint prefer-arrow-callback: 0 */
exports.Appointment = schema => {
  schema.add({
    tutorRating: {
      type: Number,
      default: 0
    },
    userRating: {
      type: Number,
      default: 0
    }
  });
};

exports.User = schema => {
  // for tutor or user
  schema.add({
    ratingAvg: {
      type: Number,
      default: 0
    },
    totalRating: {
      type: Number,
      default: 0
    },
    ratingScore: {
      type: Number,
      default: 0
    }
  });
};

exports.Webinar = schema => {
  // for webinar
  schema.add({
    ratingAvg: {
      type: Number,
      default: 0
    },
    totalRating: {
      type: Number,
      default: 0
    },
    ratingScore: {
      type: Number,
      default: 0
    }
  });
};

exports.Course = schema => {
  // for webinar
  schema.add({
    ratingAvg: {
      type: Number,
      default: 0
    },
    totalRating: {
      type: Number,
      default: 0
    },
    ratingScore: {
      type: Number,
      default: 0
    }
  });
};
