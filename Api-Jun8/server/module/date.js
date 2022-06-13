const moment = require('moment');
const momentTimeZone = require('moment-timezone');

exports.formatDate = (date, format = 'DD/MM/YYYY HH:mm', timezone = '', isDTS = false) => {
  let result = timezone ? momentTimeZone(date).tz(timezone).format(format) : moment(date).format(format);
  if (isDTS) {
    result = timezone ? momentTimeZone(date).subtract(1, 'hour').tz(timezone).format(format) : moment(date).subtract(1, 'hour').format(format);
  }
  return result;
};

exports.isDTS = (date, timezone = '') => {
  const isDTS = timezone ? momentTimeZone.tz(date, timezone).isDST() : moment(date).isDST();
  return isDTS;
};
