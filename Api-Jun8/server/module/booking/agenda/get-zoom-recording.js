/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
const moment = require('moment');

module.exports = async (job, done) => {
  try {
    const appointments = await DB.Appointment.find({
      meetingId: { $ne: null },
      meetingEnd: true,
      meetingEndAt: {
        $gt: moment().add(-5, 'minutes')
      },
      status: 'completed'
    });
    for (const appointment of appointments) {
      const recordings = await Service.ZoomUs.getRecordings(appointment.meetingId);
      const data = {
        shareUrl: recordings.share_url,
        file: recordings.recording_files,
        password: recordings.password
      };
      await DB.Appointment.update(
        { _id: appointment._id },
        {
          $set: { recordings: data }
        }
      );
    }
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'get-zoom-recording',
      error: e
    });
    done();
  }
};
