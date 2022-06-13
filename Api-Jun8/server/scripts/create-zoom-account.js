/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const users = await DB.User.find({ emailVerified: true });
    for (const user of users) {
      if (user.type === 'tutor') {
        await Service.ZoomUs.createUser({
          email: user.email
        });
      }
    }
  } catch (e) {
    throw e;
  }
};
