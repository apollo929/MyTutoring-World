const Queue = require('../../kernel/services/queue');
const availableTimeQ = Queue.create(`available_time_tutor_queue`);
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
availableTimeQ.process(async (job, done) => {
  const data = job.data.data;
  const command = job.data.command;
  try {
    if (data && data._id) {
      if (command === 'add-available-time' && data._id) {
        await DB.User.update(
          { _id: data.tutorId },
          { $addToSet: { availableTimeRange: { $each: [{ startTime: data.startTime, toTime: data.toTime }] } } }
        );
      } else if (command === 'update-available-time') {
        const oldData = job.data.oldData;
        await DB.User.update(
          { _id: data.tutorId },
          { $pull: { availableTimeRange: { startTime: oldData.startTime, toTime: oldData.toTime } } }
        );
        await DB.User.update(
          { _id: data.tutorId },
          { $addToSet: { availableTimeRange: { $each: [{ startTime: data.startTime, toTime: data.toTime }] } } }
        );
      } else {
        await DB.User.update(
          { _id: data.tutorId },
          { $pull: { availableTimeRange: { startTime: data.startTime, toTime: data.toTime } } }
        );
      }
    }
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      error: e,
      path: 'available-time-tutor-error'
    });
    done();
  }
});

exports.addAvailableTime = slot =>
  availableTimeQ
    .createJob({
      command: 'add-available-time',
      data: slot
    })
    .save();

exports.updateAvailableTime = (slot, oldSlot) =>
  availableTimeQ
    .createJob({
      command: 'update-available-time',
      data: slot,
      oldData: oldSlot
    })
    .save();
exports.removeAvailableTime = slot =>
  availableTimeQ
    .createJob({
      command: 'remove-available-time',
      data: slot
    })
    .save();
