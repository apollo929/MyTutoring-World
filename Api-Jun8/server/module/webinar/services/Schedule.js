const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const enrollQ = require('../../webinar/queue');
exports.create = async (tutorId, data) => {
  try {
    // from the range, query, get chunk then insert to the database
    // if overlap, we will skip?
    const count = await DB.Schedule.count({
      tutorId,
      $or: [
        {
          startTime: {
            $gte: moment(data.startTime).toDate(),
            $lt: moment(data.toTime).toDate()
          }
        },
        {
          toTime: {
            $gt: moment(data.startTime).toDate(),
            $lte: moment(data.toTime).toDate()
          }
        },
        {
          startTime: {
            $gt: moment(data.startTime).toDate()
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

    const slot = new DB.Schedule({
      tutorId,
      startTime: data.startTime,
      toTime: data.toTime,
      type: data.type,
      hashWebinar: data.hashWebinar ? data.hashWebinar : '',
      isFree: data.isFree,
      dtsStartTime: data.dtsStartTime,
      dtsToTime: data.dtsToTime,
      isDST: data.isDST || false
    });
    await slot.save();
    if (data.type === 'webinar' && data.webinarId) {
      const webinar = await DB.Webinar.findOne({ _id: data.webinarId });
      if (!webinar) {
        throw new Error('Webinar not found');
      }
      slot.webinarId = webinar._id;
      await slot.save();
      await Service.Webinar.setLastDate(webinar, slot);
    }

    return slot;
  } catch (e) {
    throw e;
  }
};

exports.update = async (slotId, data) => {
  try {
    const slot = slotId instanceof DB.Schedule ? slotId : await DB.Schedule.findOne({ _id: slotId });
    if (!slot) {
      throw new Error('Slot not found');
    }

    const count = await DB.Schedule.count({
      tutorId: slot.tutorId,
      _id: {
        $ne: slot._id
      },
      $or: [
        {
          startTime: {
            $gte: moment(data.startTime).toDate(),
            $lt: moment(data.toTime).toDate()
          }
        },
        {
          toTime: {
            $gt: moment(data.startTime).toDate(),
            $lte: moment(data.toTime).toDate()
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

    if (count) {
      throw new Error('The time range is overlap with another!');
    }
    slot.startTime = data.startTime;
    slot.toTime = data.toTime;
    slot.dtsStartTime = data.dtsStartTime;
    slot.dtsToTime = data.dtsToTime;

    const result = await slot.save();
    if (slot.type === 'webinar' && data.webinarId) {
      const webinar = await DB.Webinar.findOne({ _id: data.webinarId });
      if (!webinar) {
        throw new Error('Webinar not found');
      }
      await Service.Webinar.setLastDate(webinar, slot);
    }
    return result;
  } catch (e) {
    throw e;
  }
};

exports.isValid = async data => {
  try {
    const count = await DB.Schedule.count({
      _id: data.slotId,
      webinarId: data.webinarId,
      maximumStrength: {
        $gt: 0
      }
    });
    return count > 0;
  } catch (e) {
    throw e;
  }
};

exports.notifyForTutor = async beforeTimeInMinute => {
  try {
    const startTime = moment()
      .add(-1 * beforeTimeInMinute, 'minutes')
      .toDate();
    const query = {
      status: 'pending',
      type: 'webinar',
      startTime: {
        $lte: moment()
          .add(1 * beforeTimeInMinute, 'minutes')
          .toDate()
      }
    };
    const flag = `meta.sendNotifications.before.${beforeTimeInMinute}`;
    query[flag] = { $ne: true };
    const slots = await DB.Schedule.find(query);
    if (slots.length) {
      await Promise.all(
        slots.map(async slot => {
          if (
            moment().isSameOrBefore(moment(slot.startTime)) &&
            moment().isSameOrAfter(
              moment(slot.startTime)
                .add(-1 * beforeTimeInMinute, 'minutes')
                .toDate()
            )
          ) {
            const in1Hour = moment().isSameOrAfter(
              moment(slot.startTime)
                .add(-1 * 60, 'minutes')
                .toDate()
            );
            if (beforeTimeInMinute > 60 && in1Hour) {
              const updateNotifyAlert = {};
              updateNotifyAlert[flag] = true;
              await DB.Schedule.update(
                { _id: slot._id },
                {
                  $set: updateNotifyAlert
                }
              );
            } else {
              const tutor = await DB.User.findOne({ _id: slot.tutorId });
              const webinar = await DB.Webinar.findOne({ _id: slot.webinarId });
              const isEnroll = await DB.Transaction.count({
                targetType: 'webinar',
                paid: true,
                isRefund: false,
                targetId: webinar._id
              });
              if (tutor && webinar && isEnroll) {
                let startTime = slot.startTime;
                let toTime = slot.toTime;

                if (slot.isDST) {
                  startTime = tutor.timezone
                    ? momentTimeZone(slot.dtsStartTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
                    : moment(slot.dtsStartTime).format('DD/MM/YYYY HH:mm');
                  toTime = tutor.timezone
                    ? momentTimeZone(slot.dtsToTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
                    : moment(slot.dtsToTime).format('DD/MM/YYYY HH:mm');
                } else {
                  startTime = tutor.timezone
                    ? momentTimeZone(slot.startTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
                    : moment(slot.startTime).format('DD/MM/YYYY HH:mm');
                  toTime = tutor.timezone
                    ? momentTimeZone(slot.toTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
                    : moment(slot.toTime).format('DD/MM/YYYY HH:mm');
                }

                if (tutor.notificationSettings)
                  await Service.Mailer.send('appointment/notification-tutor.html', tutor.email, {
                    subject: `[Notification] Appointment #${webinar.name} at ${startTime}`,
                    tutor: tutor.getPublicProfile(),
                    slot: slot.toObject(),
                    webinar: webinar.toObject(),
                    startTime,
                    toTime
                  });
                const updateNotifyAlert = {};
                updateNotifyAlert[flag] = true;
                await DB.Schedule.update(
                  { _id: slot._id },
                  {
                    $set: updateNotifyAlert
                  }
                );
              }
            }
          }
        })
      );
    }
  } catch (error) {
    throw error;
  }
};
