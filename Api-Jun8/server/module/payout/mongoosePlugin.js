const Schema = require('mongoose').Schema;

exports.Appointment = (schema) => {
  schema.add({
    completePayout: {
      type: Boolean,
      default: false
    },
    payoutRequestId: {
      type: Schema.Types.ObjectId
    }
  });
};
