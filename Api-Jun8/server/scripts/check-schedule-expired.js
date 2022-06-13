const moment = require('moment');
module.exports = async () => {
  try {
    const tutors = await DB.User.find({ type: 'tutor' });
    for (t of tutors) {
      if (t.availableTimeRange && t.availableTimeRange.length) {
        t.availableTimeRange = t.availableTimeRange.filter(item => moment().isSameOrBefore(item.startTime));
        await t.save();
      }
    }
    return true;
  } catch (e) {
    console.log(e);
  }
};
