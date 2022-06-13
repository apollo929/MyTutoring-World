/* eslint no-nested-ternary: 0 */
const _ = require('lodash');

exports.create = async (options = {}) => {
  try {
    const error = options.error instanceof Error ? {
      name: options.error.name,
      message: options.error.message,
      stack: options.error.stack
    } : null;

    const log = new DB.Log({
      level: options.level,
      path: options.path ? options.path : (options.req ? options.req.url : null),
      reqQuery: options.query ? options.query : (options.req ? options.req.query : null),
      reqBody: options.body ? options.body : (options.req ? options.req.body : null),
      headers: options.headers ? options.headers : (options.headers ? options.headers : null),
      userId: options.userId ? options.userId : (options.req && options.req.user ? options.req.user._id : null),
      error
    });

    await log.save();
  } catch (e) {
    throw e;
  }
};
