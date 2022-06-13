/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const tutors = await DB.User.find({ emailVerified: true, type: 'tutor' });
    for (const tutor of tutors) {
      const data = await Service.ZoomUs.getUser(tutor.email);
      if (data && data.status === 'active') {
        tutor.isZoomAccount = true;
        tutor.zoomAccountInfo = data;
      } else {
        tutor.isZoomAccount = false;
        tutor.zoomAccountInfo = null;
      }
      await tutor.save();
    }
  } catch (e) {
    throw e;
  }
};
