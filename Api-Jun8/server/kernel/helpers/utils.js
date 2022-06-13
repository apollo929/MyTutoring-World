/* eslint no-param-reassign: 0 */
const _ = require('lodash');
const moment = require('moment');

class UtilsHelper {
  /**
   * replace empty string, undefined... with new value
   *
   * @param  {Object} obj   Input
   * @param  {Mixed} value replaced data
   * @return {void}
   */
  static replaceEmptyAttributes(obj, value) {
    Object.keys(obj).forEach((i) => {
      if (!obj[i]) {
        /* eslint-disable */
        obj[i] = value;
        /* eslint-enable */
      }
    });
  }

  /**
   * replace empty string, undefined... with new value
   *
   * @param  {Object} obj   Input
   * @return {void}
   */
  static removeEmptyAttributes(obj) {
    return _(obj).omitBy(_.isUndefined).omitBy(_.isNull).omitBy(_.isEmpty)
      .value();
  }

  /**
   * populate response data from
   * @param  {Object} result ES result
   * @return {Object}
   */
  static populateSearchResults(result) {
    return {
      totalItem: result.hits.total,
      items: result.hits.hits.map(hit => hit._source)
    };
  }

  /**
   * populate response data from
   * @param  {Object} result ES result
   * @return {Object}
   */
  static populateSearchResult(result) {
    return result._source || null;
  }

  /**
  * get date ranges
  */
  static getDatesRange(start, stop) {
    const dateArray = [];
    const stopDate = moment(stop);
    let currentDate = moment(start);

    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'days');
    }

    return dateArray;
  }

  static unflatten(array, parent, tree) {
    let returnTree = typeof tree !== 'undefined' ? tree : [];
    // parent = typeof parent !== 'undefined' ? parent : { parentId: null };

    const children = _.filter(array, child => (!parent ? (!child.parentId) : (child.parentId && child.parentId.toString() === parent._id.toString())));
    if (!_.isEmpty(children)) {
      if (!parent) {
        returnTree = children;
      } else {
        parent.children = children;
      }
      _.each(children, child => UtilsHelper.unflatten(array, child));
    }

    return returnTree;
  }

  static flatten(node) {
    const tree = Array.isArray(node) ? node : [node];
    let result = [];
    tree.forEach((item) => {
      result.push(item);

      if (item.children) {
        result = result.concat(UtilsHelper.flatten(item.children));
      }
    });

    return result;
  }

  static findChildNode(node, nodeId) {
    const tree = Array.isArray(node) ? node : [node];
    let data;
    for (let i = 0; i < tree.length; i++) {
      if (tree[i]._id.toString() === nodeId.toString()) {
        data = tree[i];
        return data;
      }
      if (tree[i].children) {
        const n = UtilsHelper.findChildNode(tree[i].children);
        if (n) {
          return n;
        }
      }
    }

    return data;
  }

  static markNullEmpty(object, fields = []) {
    fields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(object, f) && !object[f]) {
        object[f] = null;
      }
    });
  }
}

module.exports = UtilsHelper;
