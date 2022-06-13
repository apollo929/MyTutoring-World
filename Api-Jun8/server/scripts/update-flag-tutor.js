/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const tutors = await DB.User.find({ type: 'tutor' });
    for (const tutor of tutors) {
      if (tutor.country && tutor.country.code) {
        // console.log(tutor.country);
        // tutor.country['flag'] = new URL(`flags/${tutor.country.code.toLowerCase()}.svg`, process.env.baseUrl).href;
        const newData = Object.assign(tutor.country, {
          flag: new URL(`flags/${tutor.country.code.toLowerCase()}.svg`, process.env.baseUrl).href
        });
        await DB.User.update(
          { _id: tutor._id },
          {
            $set: {
              country: newData
            }
          }
        );
      }
    }
  } catch (e) {
    throw e;
  }
};
