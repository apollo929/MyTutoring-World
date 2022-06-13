const Schema = require('mongoose').Schema;

/**
 * @ngdoc function
 * @name schema.event
 * @description
 * Mongoose Plugin helper to add schema.org's Event properties
 * @param {object} schema the schema which will be added with the Event properties
 * @param {object} options the option object
 */
const event = (schema, options) => {
  schema.defaults({
    attendee: Schema.Types.Mixed,
    doorTime: Date,
    duration: Number,
    endDate: Date,
    eventStatus: Schema.Types.Mixed,
    location: Schema.Types.Mixed,
    offers: Schema.Types.Mixed,
    performer: Schema.Types.Mixed,
    previousStartDate: Date,
    startDate: Date,
    subEvent: Schema.Types.Mixed,
    superEvent: Schema.Types.Mixed,
    typicalAgeRange: String
  });

  if (options && options.indexStartDate) {
    schema.path('startDate').index(options.indexStartDate);
  }
};

module.exports = event;
