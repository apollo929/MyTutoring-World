const moment = require('moment');

exports.create = async (userId, data) => {
  try {
    // from the range, query, get chunk then insert to the database
    // if overlap, we will skip?
    const count = await DB.AvailableTime.count({
      userId,
      $or: [
        {
          startTime: {
            $gt: moment(data.startTime).toDate(),
            $lt: moment(data.toTime).toDate()
          }
        },
        {
          toTime: {
            $gt: moment(data.startTime).toDate(),
            $lt: moment(data.toTime).toDate()
          }
        },
        {
          startTime: {
            $gte: moment(data.startTime).toDate()
          },
          toTime: {
            $lt: moment(data.toTime).toDate()
          }
        }
      ]
    });
    if (count) {
      throw new Error('The time range is overlap with another!');
    }
    return DB.AvailableTime.create({
      userId,
      startTime: data.startTime,
      toTime: data.toTime
    });
  } catch (e) {
    throw e;
  }
};

exports.update = async (availableTimeId, data) => {
  try {
    const availableTime =
      availableTimeId instanceof DB.AvailableTime
        ? availableTimeId
        : await DB.AvailableTime.findOne({ _id: availableTimeId });
    if (!availableTime) {
      throw new Error('No available time available');
    }

    const count = await DB.AvailableTime.count({
      userId: availableTime.userId,
      _id: {
        $ne: availableTime._id
      },
      $or: [
        {
          startTime: {
            $gt: moment(data.startTime).toDate(),
            $lt: moment(data.toTime).toDate()
          }
        },
        {
          toTime: {
            $gt: moment(data.startTime).toDate(),
            $lt: moment(data.toTime).toDate()
          }
        },
        {
          startTime: {
            $lt: moment(data.startTime).toDate()
          },
          toTime: {
            $gt: moment(data.toTime).toDate()
          }
        }
      ]
    });

    // console.log('count>> ', count);
    // console.log('moment startTime toDate> ', moment(data.startTime).toDate());
    // console.log('moment startTime toISOString> ', moment(data.startTime).toISOString());
    // console.log('new Date: ', new Date(data.startTime));

    if (count) {
      throw new Error('The time range is overlap with another!');
    }

    availableTime.startTime = data.startTime;
    availableTime.toTime = data.toTime;

    return availableTime.save();
  } catch (e) {
    throw e;
  }
};

exports.isValid = async data => {
  try {
    const count = await DB.Schedule.count({
      tutorId: data.tutorId,
      startTime: {
        $lte: moment(data.startTime).toDate()
      },
      toTime: {
        $gte: moment(data.toTime).toDate()
      },
      type: data.type
    });
    return count > 0;
  } catch (e) {
    throw e;
  }
};
