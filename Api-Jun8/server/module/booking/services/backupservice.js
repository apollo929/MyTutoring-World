const moment = require('moment');
const url = require('url');

exports.cancel = async (appointmentId, reason, cancelBy) => {
  try {
    const appointment = await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    appointment.status = 'canceled';
    appointment.cancelBy = cancelBy;
    appointment.cancelReason = reason;
    await appointment.save();

    // notify email to user about cancel appointment
    const userCancel = cancelBy.toObject ? cancelBy : await DB.User.findOne({ _id: cancelBy });
    const user = await DB.User.findOne({ _id: appointment.userId });
    const tutor = await DB.User.findOne({ _id: appointment.tutorId });
    const data = {
      subject: `Réservation ${appointment.code} a été annulée`,
      user: user.toObject(),
      tutor: tutor.toObject(),
      cancelBy: userCancel,
      appointment: appointment.toObject()
    };
    if (tutor.notificationSettings) await Service.Mailer.send('appointment/cancel-tutor.html', tutor.email, data);
    if (user.notificationSettings) await Service.Mailer.send('appointment/cancel-user.html', user.email, data);
    return appointment;
  } catch (e) {
    throw e;
  }
};

exports.canAdd = async options => {
  try {
    // TODO - dont need check pending appointment
    const count = await DB.Appointment.count({
      tutorId: options.tutorId,
      $or: [
        {
          startTime: {
            $gt: moment(options.startTime).toDate(),
            $lt: moment(options.toTime).toDate()
          }
        },
        {
          startTime: {
            $gte: moment(options.startTime).toDate()
          },
          toTime: {
            $lte: moment(options.toTime).toDate()
          }
        },
        {
          toTime: {
            $gt: moment(options.startTime).toDate(),
            $lt: moment(options.toTime).toDate()
          }
        }
      ],
      paid: true
    });
    return !count;
  } catch (e) {
    throw e;
  }
};

exports.sendNotify = async appointmentId => {
  try {
    const appointment = appointmentId instanceof DB.Appointment ? appointmentId : await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('No appoinemnt found!');
    }

    const tutor = await DB.User.findOne({ _id: appointment.tutorId });
    const user = await DB.User.findOne({ _id: appointment.userId });
    if (!tutor || !user) {
      throw new Error('Cannot found user or tutor');
    }

    // create zoom us link
    if (!appointment.zoomData || !appointment.zoomData.start_url) {
      const zoomData = await Service.ZoomUs.createMeeting({
        email: tutor.email
      });
      appointment.zoomData = zoomData;
      appointment.meetingId = zoomData.id;
      await appointment.save();
    }

    const timeFormat = moment(appointment.startTime).format('DD/MM/YYYY HH:mm');
    if (tutor.notificationSettings)
      await Service.Mailer.send('appointment/notification-tutor.html', tutor.email, {
        subject: `[Notification] Réservation #${appointment.code} à ${timeFormat}`,
        appointment: appointment.toObject(),
        tutor: tutor.getPublicProfile(),
        user: user.getPublicProfile()
      });

    if (user.notificationSettings)
      await Service.Mailer.send('appointment/notification-user.html', user.email, {
        subject: `[Notification] Réservation #${appointment.code} à ${timeFormat}`,
        appointment: appointment.toObject(),
        tutor: tutor.getPublicProfile(),
        user: user.getPublicProfile()
      });
  } catch (e) {
    throw e;
  }
};

exports.complete = async appointmentId => {
  try {
    const appointment = appointmentId instanceof DB.Appointment ? appointmentId : await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = 'completed';
    await appointment.save();

    const user = await DB.User.findOne({ _id: appointment.userId });
    const tutor = await DB.User.findOne({ _id: appointment.tutorId });

    if (user.notificationSettings)
      await Service.Mailer.send('review/notify-review.html', user.email, {
        subject: `Réservation ${appointment.code} a été complètement réalisée`,
        appointment: appointment.toObject(),
        tutor: tutor.getPublicProfile(),
        user: user.getPublicProfile(),
        reviewLink: url.resolve(process.env.userWebUrl, `appointments/${appointment._id}/reviews`)
      });

    if (tutor.notificationSettings)
      await Service.Mailer.send('review/notify-review.html', tutor.email, {
        subject: `Réservation ${appointment.code} a été complètement réalisée`,
        appointment: appointment.toObject(),
        tutor: tutor.getPublicProfile(),
        user: user.getPublicProfile(),
        reviewLink: url.resolve(process.env.userWebUrl, `appointments/${appointment._id}/reviews`)
      });
  } catch (e) {
    throw e;
  }
};

exports.endMeeting = async zoomMeetingId => {
  try {
    const appointment = await DB.Appointment.findOne({ meetingId: zoomMeetingId });
    if (!appointment) {
      throw new Error('Appointment not found!');
    }

    appointment.meetingEnd = true;
    appointment.meetingEndAt = new Date();
    return appointment.save();
  } catch (e) {
    throw e;
  }
};

exports.getRecording = async (zoomMeetingId, file, shareUrl) => {
  try {
    const appointment = await DB.Appointment.findOne({ meetingId: zoomMeetingId });
    if (!appointment) {
      throw new Error('Appointment not found!');
    }
    const recordings = {
      shareUrl,
      file
    };
    await DB.Appointment.update(
      { _id: appointment._id },
      {
        $set: { recordings }
      }
    );
    return appointment.save();
  } catch (e) {
    throw e;
  }
};
