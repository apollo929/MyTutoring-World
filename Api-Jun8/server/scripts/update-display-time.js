/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const appointments = await DB.Appointment.find({});
    for (const item of appointments) {
      await DB.Appointment.update(
        { _id: item._id },
        {
          $set: {
            displayStartTime: item.startTime,
            displayToTime: item.toTime
          }
        }
      );
    }
  } catch (e) {
    throw e;
  }
};
