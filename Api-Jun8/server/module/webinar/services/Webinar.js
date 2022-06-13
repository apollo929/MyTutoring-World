const moment = require('moment');
const momentTimeZone = require('moment-timezone');

exports.setLastDate = async (webinar, schedule) => {
  if (!webinar.lastSlot) {
    await DB.Webinar.update(
      {
        _id: webinar._id
      },
      {
        $set: {
          lastSlot: schedule,
          lastDate: schedule.startTime,
          isOpen: true
        }
      }
    );
  } else {
    const count = await DB.Webinar.count({
      _id: webinar._id,
      lastDate: {
        $lt: moment(schedule.startTime).toDate()
      }
    });

    if (count) {
      await DB.Webinar.update(
        {
          _id: webinar._id
        },
        {
          $set: {
            lastSlot: schedule,
            lastDate: schedule.startTime,
            isOpen: true
          }
        }
      );
    }
  }
};

exports.updateLastDate = async slot => {
  const schedules = await DB.Schedule.find({ webinarId: slot.webinarId }).sort({ startTime: -1 });
  if (schedules && schedules.length > 0) {
    await DB.Webinar.update(
      {
        _id: slot.webinarId
      },
      {
        $set: {
          lastSlot: schedules[0],
          lastDate: schedules[0].startTime
        }
      }
    );
  }
  return true;
};

exports.createWebinarPerSlot = async (webinarId, beforeTimeInMinute) => {
  try {
    const startTime = moment()
      .add(-1 * beforeTimeInMinute, 'minutes')
      .toDate();
    const query = {
      startTime: {
        $gte: startTime
      },
      webinarId: webinarId,
      $or: [{ status: 'scheduled' }, { status: 'progressing' }]
    };
    // const flag = `meta.sendNotifications.before.${beforeTimeInMinute}`;
    // query[flag] = { $ne: true };
    const flag = `notifyForTutor.sendNotifications.before.${beforeTimeInMinute}`;
    query[flag] = { $ne: true };
    const slots = await DB.Schedule.find(query);

    if (slots.length) {
      await Promise.all(
        slots.map(async slot => {
          const tutor = await DB.User.findOne({ _id: slot.tutorId });
          if (!tutor) {
            throw new Error('Cannot found tutor');
          }
          const webinar = await DB.Webinar.findOne({ _id: slot.webinarId });
          if (!webinar) {
            throw new Error('Cannot found webinar');
          }
          if (slot.zoomData && slot.zoomData.start_url) {
            const startTime = tutor.timezone
              ? momentTimeZone(slot.displayStartTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
              : moment(slot.displayStartTime).format('DD/MM/YYYY HH:mm');
            const toTime = tutor.timezone
              ? momentTimeZone(slot.displayToTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
              : moment(slot.displayToTime).format('DD/MM/YYYY HH:mm');

            if (tutor.notificationSettings)
              await Service.Mailer.send('appointment/notification-tutor.html', tutor.email, {
                subject: `[Notification] Réservation #${webinar.name} à ${startTime}`,
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

            // const countAppointment = await DB.Appointment.count({
            //   userId: tutor._id,
            //   slotId: slot._id
            // });
            // if (!countAppointment) {
            //   const appointment = new DB.Appointment({
            //     userId: tutor._id,
            //     slotId: slot._id,
            //     webinarId: webinar._id,
            //     zoomData: slot.zoomData,
            //     startTime: slot.startTime,
            //     toTime: slot.toTime,
            //     meetingId: slot.zoomData.id
            //   });
            //   await appointment.save();
            // }
            // await Service.Enroll.sendNotify(webinar, slot, tutor, beforeTimeInMinute);
          }
        })
      );
    }
  } catch (error) {
    throw error;
  }
};
