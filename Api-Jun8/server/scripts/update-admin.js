/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const users = await DB.User.find({ role: 'admin' });
    for (const user of users) {
      user.isZoomAccount = true;
      await user.save();
    }
  } catch (e) {
    throw e;
  }
};
