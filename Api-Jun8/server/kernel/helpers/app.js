const url = require('url');
const nconf = require('nconf');
const mongoose = require('mongoose');

exports.isObjectId = str => /^[a-fA-F0-9]{24}$/.test(str);

exports.isMongoId = str => /^[a-fA-F0-9]{24}$/.test(str);

exports.toObjectId = str => mongoose.Types.ObjectId(str);

/**
 * get public file url in the public folder with absolute url
 *
 * @param  {String} filePath
 * @return {String}
 */
exports.getPublicFileUrl = filePath => {
  if (!filePath || Helper.String.isUrl(filePath)) {
    return filePath;
  }

  // local file, replace, remove public
  const newPath = filePath.indexOf('public/') === 0 ? filePath.replace('public/', '') : filePath;
  return url.resolve(nconf.get('baseUrl'), newPath);
};

/**
 * populate search mongo search query
 * @type {Object}
 */
exports.populateDbQuery = (query, options = {}) => {
  const match = {};
  (options.text || []).forEach(k => {
    if (query[k]) {
      match[k] = { $regex: query[k].trim(), $options: 'i' };
    }
  });

  (options.boolean || []).forEach(k => {
    if (['false', '0'].indexOf(query[k]) > -1) {
      match[k] = false;
    } else if (query[k]) {
      match[k] = true;
    }
  });

  (options.equal || []).forEach(k => {
    if (query[k]) {
      match[k] = query[k];
    }
  });

  return match;
};

/**
 * get sort query for mongo db
 *
 * @param  {[type]} query                     express query object
 * @param  {String} [defaultSort='createdAt'] default sort field
 * @param  {Number} [defaultSortType=-1]      default sort type, -1, 1, desc or asc
 * @return {Object} mongo db sort query
 */
exports.populateDBSort = (query, defaultSort = 'createdAt', defaultSortType = -1) => {
  const sort = {};
  if (query.sort) {
    sort[query.sort] = ['asc', '1'].indexOf(query.sortType) > -1 ? 1 : -1;
  } else {
    sort[defaultSort] = defaultSortType;
  }

  return sort;
};
