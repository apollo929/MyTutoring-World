/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
const moment = require('moment');

module.exports = async () => {
  try {
    const tutors = await DB.User.find({ type: 'tutor' });
    const users = await DB.User.find({ type: 'user' });
    const subject = await DB.Subject.findOne();

    if (!tutors.length || !users.length) {
      throw new Error('No users or tutors!');
    }

    for (const tutor of tutors) {
      for (const user of users) {
        const appointment = new DB.Appointment({
          tutorId: tutor._id,
          userId: user._id,
          startTime: moment().set('hour', 8),
          toTime: moment().set('hour', 10),
          subjectId: subject ? subject._id : null
        });

        await appointment.save();
      }
    }
  } catch (e) {
    throw e;
  }
};
