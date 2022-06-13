/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const items = await DB.Appointment.find({ recordings: { $ne: null } });
    for (const item of items) {
      if (typeof item.recordings === 'string') {
        const json = JSON.parse(item.recordings);
        item.recordings = json;
        await item.save();
      }
    }
  } catch (e) {
    throw e;
  }
};
