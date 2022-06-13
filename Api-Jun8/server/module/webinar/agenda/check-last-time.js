const moment = require('moment');
module.exports = async (job, done) => {
  try {
    const webinars = await DB.Webinar.find({
      isOpen: true,
      lastDate: {
        // $lt: Date.now()
        $lte: moment().add(-30, 'minutes').toDate()
      }
    });
    if (webinars.length) {
      await Promise.all(
        webinars.map(webinar => {
          DB.Webinar.update(
            { _id: webinar._id },
            {
              $set: { isOpen: false }
            }
          );
        })
      );
    }

    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'check-last-time',
      error: e
    });
    done();
  }
};
