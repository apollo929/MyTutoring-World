const Schema = require('mongoose').Schema;

/**
 * @ngdoc function
 * @name schema.person
 * @description
 * Mongoose Plugin helper to add schema.org's Person properties
 * @param {object} schema the schema which will be added with the Person properties
 * @param {object} options the option object
 */
const person = (schema) => {
  schema.defaults({
    additionalName: String,
    address: Schema.Types.Mixed,
    affiliation: Schema.Types.Mixed,
    alumniOf: Schema.Types.Mixed,
    award: String,
    birthDate: Date,
    brand: Schema.Types.Mixed,
    children: Schema.Types.Mixed,
    colleague: Schema.Types.Mixed,
    contactPoint: Schema.Types.Mixed,
    deathDate: Date,
    duns: String,
    email: String,
    familyName: String,
    faxNumber: String,
    follows: Schema.Types.Mixed,
    gender: String,
    givenName: String,
    globalLocationNumber: String,
    hasPOS: Schema.Types.Mixed,
    homeLocation: Schema.Types.Mixed,
    honorificPrefix: String,
    honorificSuffix: String,
    interactionCount: String,
    isicV4: String,
    jobTitle: String,
    knows: Schema.Types.Mixed,
    makesOffer: Schema.Types.Mixed,
    memberOf: Schema.Types.Mixed,
    naics: String,
    nationality: Schema.Types.Mixed,
    owns: Schema.Types.Mixed,
    parent: Schema.Types.Mixed,
    performerIn: Schema.Types.Mixed,
    relatedTo: Schema.Types.Mixed,
    seeks: Schema.Types.Mixed,
    sibling: Schema.Types.Mixed,
    spouse: Schema.Types.Mixed,
    taxID: String,
    telephone: String,
    vatID: String,
    workLocation: Schema.Types.Mixed,
    worksFor: Schema.Types.Mixed
  });
};
module.exports = person;
