const moment = require('moment');
const url = require('url');
const momentTimeZone = require('moment-timezone');
const date = require('../../date');
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
    if (appointment.targetType === 'webinar') {
      const slot = await DB.Schedule.findOne({ _id: appointment.slotId });
      if (slot) {
        slot.status = 'scheduled';
        await slot.save();
      }
    }
    // notify email to user about cancel appointment
    const userCancel = await DB.User.findOne({ _id: cancelBy });
    const user = await DB.User.findOne({ _id: appointment.userId });
    const tutor = await DB.User.findOne({ _id: appointment.tutorId });
    const startTimeUser = date.formatDate(
      appointment.startTime,
      'DD/MM/YYYY HH:mm',
      user.timezone || '',
      date.isDTS(appointment.startTime, user.timezone || '')
    );
    const toTimeUser = date.formatDate(
      appointment.toTime,
      'DD/MM/YYYY HH:mm',
      user.timezone || '',
      date.isDTS(appointment.toTime, user.timezone || '')
    );
    const startTimeTutor = date.formatDate(
      appointment.startTime,
      'DD/MM/YYYY HH:mm',
      tutor.timezone || '',
      date.isDTS(appointment.startTime, tutor.timezone || '')
    );
    const toTimeTutor = date.formatDate(
      appointment.toTime,
      'DD/MM/YYYY HH:mm',
      tutor.timezone || '',
      date.isDTS(appointment.toTime, tutor.timezone || '')
    );
    const data = {
      subject: `Reservation ${appointment.code} has been canceled`,
      user: user.getPublicProfile(),
      tutor: tutor.getPublicProfile(),
      cancelBy: userCancel,
      appointment: appointment.toObject(),
      startTimeUser,
      toTimeUser,
      startTimeTutor,
      toTimeTutor
    };

    const transaction = await DB.Transaction.findOne({ _id: appointment.transactionId });
    if (transaction) {
      const refundRequest = new DB.RefundRequest({
        userId: user._id,
        transactionId: transaction._id,
        amount: transaction && transaction.couponCode ? transaction.priceDiscount : transaction.price,
        reason: reason || '',
        transactionId: transaction._id,
        type: 'before',
        targetType: transaction.targetType || '',
        tutorId: transaction.tutorId,
        targetId: transaction.targetId || null
      });
      transaction.isRefund = true;
      transaction.status = 'pending-refund';
      await transaction.save();
      await refundRequest.save();
      if (tutor.notificationSettings) await Service.Mailer.send('appointment/cancel-tutor.html', tutor.email, data);
      if (user.notificationSettings)
        await Service.Mailer.send(
          'appointment/cancel-user.html',
          user.email,
          Object.assign(data, {
            refundRequest
          })
        );
    }
    return appointment;
  } catch (e) {
    throw e;
  }
};

exports.userCancel = async (appointmentId, reason, cancelBy) => {
  try {
    const appointment = appointmentId instanceof DB.Appointment ? appointmentId : await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    const user = await DB.User.findOne({ _id: appointment.userId });
    const tutor = await DB.User.findOne({ _id: appointment.tutorId });
    const userCancel = user._id.toString() === cancelBy.toString() ? user : tutor;

    const appointmentsCreatedByTransaction = await DB.Appointment.find({ transactionId: appointment.transactionId })
      .sort({
        startTime: 1
      })
      .skip(0)
      .limit(1000)
      .exec();
    const firstAppointment = appointmentsCreatedByTransaction && appointmentsCreatedByTransaction.length ? appointmentsCreatedByTransaction[0] : null;
    if (!firstAppointment) {
      throw new Error('There have been no appointments created from this transaction yet');
    }
    let isBefore = false;
    if (userCancel.timezone) {
      isBefore = momentTimeZone
        .utc()
        .tz(userCancel.timezone)
        .isSameOrBefore(
          momentTimeZone
            .utc(firstAppointment.startTime)
            .tz(userCancel.timezone)
            .add(-1 * 1440, 'minutes')
            .toDate()
        );
    } else {
      isBefore = moment().isSameOrBefore(
        moment(firstAppointment.startTime)
          .add(-1 * 1440, 'minutes')
          .toDate()
      );
    }

    if (!isBefore) {
      throw new Error(
        `Can't request, your appointment will start at ${
          userCancel.timezone
            ? momentTimeZone.utc(firstAppointment.startTime).tz(userCancel.timezone).format('DD/MM/YYYY HH:mm')
            : moment(firstAppointment.startTime).format('DD/MM/YYYY HH:mm')
        },
        please request 24 hours in advance before the appointment start`
      );
    }

    if (appointment.targetType === 'webinar') {
      const appointmentsInProgress = appointmentsCreatedByTransaction.filter(item => item.meetingStart);
      if (appointmentsInProgress.length) {
        throw new Error('You are in the process of webinar, cannot cancel this appointment appointment');
      }
    }

    appointment.status = 'canceled';
    appointment.cancelBy = cancelBy;
    appointment.cancelReason = reason;
    await appointment.save();
    if (appointment.targetType === 'webinar') {
      const slot = await DB.Schedule.findOne({ _id: appointment.slotId });
      if (slot) {
        slot.status = 'scheduled';
        await slot.save();
      }
      for (const a of appointmentsCreatedByTransaction) {
        a.status = 'canceled';
        a.cancelBy = cancelBy;
        a.cancelReason = reason;
        await a.save();
      }
    }

    const startTimeUser = date.formatDate(
      appointment.startTime,
      'DD/MM/YYYY HH:mm',
      user.timezone || '',
      date.isDTS(appointment.startTime, user.timezone || '')
    );
    const toTimeUser = date.formatDate(
      appointment.toTime,
      'DD/MM/YYYY HH:mm',
      user.timezone || '',
      date.isDTS(appointment.toTime, user.timezone || '')
    );
    const startTimeTutor = date.formatDate(
      appointment.startTime,
      'DD/MM/YYYY HH:mm',
      tutor.timezone || '',
      date.isDTS(appointment.startTime, tutor.timezone || '')
    );
    const toTimeTutor = date.formatDate(
      appointment.toTime,
      'DD/MM/YYYY HH:mm',
      tutor.timezone || '',
      date.isDTS(appointment.toTime, tutor.timezone || '')
    );

    const data = {
      subject: `Reservation ${appointment.code} has been canceled`,
      user: user.getPublicProfile(),
      tutor: tutor.getPublicProfile(),
      cancelBy: userCancel.getPublicProfile(),
      appointment: appointment.toObject(),
      startTimeUser,
      toTimeUser,
      startTimeTutor,
      toTimeTutor
    };

    const transaction = await DB.Transaction.findOne({ _id: appointment.transactionId });
    let refundRequest = null;
    if (transaction) {
      if (!appointment.isFree && transaction.price > 0) {
        refundRequest = new DB.RefundRequest({
          userId: user._id,
          transactionId: transaction._id,
          amount: transaction && transaction.couponCode ? transaction.priceDiscount : transaction.price,
          reason: reason || '',
          type: 'before',
          targetType: transaction.targetType || '',
          targetId: transaction.targetId || null,
          courseId: null,
          isNewItem: true,
          tutorId: transaction.tutorId
        });
        transaction.isRefund = true;
        transaction.status = 'pending-refund';
        await transaction.save();
        await refundRequest.save();
      }
      await Service.Mailer.send(
        'appointment/cancel-admin.html',
        process.env.EMAIL_NOTIFICATION_PAYOUT_REQUEST,
        Object.assign(data, {
          refundRequest,
          userType: userCancel.type
        })
      );
      if (userCancel.type === 'tutor' && user.notificationSettings === true) {
        await Service.Mailer.send(
          'appointment/cancel-user.html',
          user.email,
          Object.assign(data, {
            refundRequest
          })
        );
        if (tutor.notificationSettings) await Service.Mailer.send('appointment/tutor-cancel-success.html', tutor.email, data);
      } else {
        if (tutor.notificationSettings) await Service.Mailer.send('appointment/cancel-tutor.html', tutor.email, data);
        if (user.notificationSettings)
          await Service.Mailer.send(
            'appointment/student-cancel-success.html',
            user.email,
            Object.assign(data, {
              refundRequest: refundRequest
            })
          );
      }
    }

    return appointment;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.checkNotStart = async appointmentId => {
  try {
    const appointment = appointmentId instanceof DB.Appointment ? appointmentId : await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const tutor = await DB.User.findOne({ _id: appointment.tutorId });
    const user = await DB.User.findOne({ _id: appointment.userId });

    const startTime = moment(appointment.startTime).format('DD/MM/YYYY HH:mm');
    const toTime = moment(appointment.toTime).format('DD/MM/YYYY HH:mm');
    const data = {
      subject: `Tutor did not start meeting for the class #${appointment.code}`,
      appointment: appointment.toObject(),
      startTime: startTime,
      toTime: toTime,
      tutorName: tutor.name,
      userName: user.name
    };
    //send mail to admin
    await Service.Mailer.send('appointment/tutor-not-start-meeting-to-admin.html', process.env.ADMIN_EMAIL, data);

    const startTimeTutor = date.formatDate(
      appointment.startTime,
      'DD/MM/YYYY HH:mm',
      tutor.timezone || '',
      date.isDTS(appointment.startTime, tutor.timezone || '')
    );
    const toTimeTutor = date.formatDate(
      appointment.toTime,
      'DD/MM/YYYY HH:mm',
      tutor.timezone || '',
      date.isDTS(appointment.toTime, tutor.timezone || '')
    );

    const dataTutor = {
      subject: `You did not start meeting for the class #${appointment.code}`,
      appointment: appointment.toObject(),
      startTime: startTimeTutor,
      toTime: toTimeTutor,
      userName: user.name,
      tutorName: tutor.name
    };
    //send mail to tutor
    if (tutor.notificationSettings) await Service.Mailer.send('appointment/tutor-not-start-meeting.html', tutor.email, dataTutor);

    appointment.status = 'not-start';
    appointment.zoomData = null;
    await appointment.save();

    if (appointment.targetType === 'webinar') {
      const slot = await DB.Schedule.findOne({ _id: appointment.slotId });
      if (slot) {
        slot.status = 'not-start';
        await slot.save();
      }
      const countAppointments = await DB.Appointment.count({ transactionId: appointment.transactionId });
      const countNotStart = await DB.Appointment.count({ transactionId: appointment.transactionId, status: 'not-start' });
      if (countAppointments === countNotStart)
        await DB.Transaction.update(
          { _id: appointment.transactionId },
          {
            $set: { isRefund: true }
          }
        );
    } else {
      await DB.Transaction.update(
        { _id: appointment.transactionId },
        {
          $set: { isRefund: true }
        }
      );
    }
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
      status: { $ne: 'canceled' },
      paid: true
    });
    return !count;
  } catch (e) {
    throw e;
  }
};

exports.sendNotify = async appointmentId => {
  try {
    const appointment = await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      return false;
    }
    const tutor = await DB.User.findOne({ _id: appointment.tutorId });
    if (!tutor) {
      return false;
    }
    const user = await DB.User.findOne({ _id: appointment.userId });
    if (!user) {
      return false;
    }
    const transaction = await DB.Transaction.findOne({ _id: appointment.transactionId });
    if (!transaction) {
      return false;
    }
    if (appointment.targetType === 'webinar') {
      const webinar = await DB.Webinar.findOne({ _id: appointment.webinarId });
      if (!webinar) {
        // throw new Error('Cannot found webinar');
        return false;
      }

      const slot = await DB.Schedule.findOne({ _id: appointment.slotId });
      if (!slot) {
        return false;
      }
      appointment.status = 'pending';
      await appointment.save();
      slot.status = 'pending';
      await slot.save();
      const startTime = date.formatDate(slot.startTime, 'DD/MM/YYYY HH:mm', user.timezone || '', date.isDTS(slot.startTime, user.timezone || ''));
      const toTime = date.formatDate(slot.toTime, 'DD/MM/YYYY HH:mm', user.timezone || '', date.isDTS(slot.toTime, user.timezone || ''));
      if (user.notificationSettings)
        await Service.Mailer.send('appointment/notification-user.html', user.email, {
          subject: `[Notification] Booking #${webinar.name} at ${startTime}`,
          appointment: appointment.toObject(),
          slot: slot.toObject(),
          tutor: tutor.getPublicProfile(),
          user: user.getPublicProfile(),
          webinar: webinar.toObject(),
          startTime,
          toTime
        });
    } else if (appointment.targetType === 'subject') {
      appointment.status = 'pending';
      await appointment.save();
      const startTimeTutor = date.formatDate(
        appointment.startTime,
        'DD/MM/YYYY HH:mm',
        tutor.timezone || '',
        date.isDTS(appointment.startTime, tutor.timezone || '')
      );
      const toTimeTutor = date.formatDate(
        appointment.toTime,
        'DD/MM/YYYY HH:mm',
        tutor.timezone || '',
        date.isDTS(appointment.toTime, tutor.timezone || '')
      );
      if (tutor.notificationSettings)
        await Service.Mailer.send('appointment/notification-tutor-class.html', tutor.email, {
          subject: `[Notify] Appointment #${appointment.code} at ${startTimeTutor}`,
          appointment: appointment.toObject(),
          tutor: tutor.getPublicProfile(),
          user: user.getPublicProfile(),
          transaction: transaction.toObject(),
          startTime: startTimeTutor,
          toTime: toTimeTutor
        });
      const startTimeUser = date.formatDate(
        appointment.startTime,
        'DD/MM/YYYY HH:mm',
        user.timezone || '',
        date.isDTS(appointment.startTime, user.timezone || '')
      );
      const toTimeUser = date.formatDate(
        appointment.toTime,
        'DD/MM/YYYY HH:mm',
        user.timezone || '',
        date.isDTS(appointment.toTime, user.timezone || '')
      );
      if (user.notificationSettings)
        await Service.Mailer.send('appointment/notification-user-class.html', user.email, {
          subject: `[Notify] Appointment #${appointment.code} at ${startTimeUser}`,
          appointment: appointment.toObject(),
          tutor: tutor.getPublicProfile(),
          user: user.getPublicProfile(),
          transaction: transaction.toObject(),
          startTime: startTimeUser,
          toTime: toTimeUser
        });
    }
  } catch (e) {
    console.log(e);
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
        subject: `Appointment #${appointment.code} has been completed`,
        appointment: appointment.toObject(),
        tutor: tutor.getPublicProfile(),
        user: user.getPublicProfile(),
        type: 'student',
        reviewLink: url.resolve(process.env.userWebUrl, `users/lessons/${appointment._id}`)
      });
    if (appointment.targetType === 'subject') {
      if (tutor.notificationSettings)
        await Service.Mailer.send('review/notify-review.html', tutor.email, {
          subject: `Appointment #${appointment.code} has been completed`,
          appointment: appointment.toObject(),
          tutor: tutor.getPublicProfile(),
          user: user.getPublicProfile(),
          type: 'tutor',
          reviewLink: url.resolve(process.env.userWebUrl, `users/appointments/${appointment._id}`)
        });
    } else if (appointment.targetType === 'webinar') {
      const slot = await DB.Schedule.findOne({ _id: appointment.slotId });
      if (slot) {
        const webinar = await DB.Webinar.findOne({ _id: slot.webinarId });
        if (!webinar) {
          slot.status = 'canceled';
          await slot.save();
        } else {
          if (tutor.notificationSettings)
            await Service.Mailer.send('review/notify-review-tutor.html', tutor.email, {
              subject: `Reservation ${(webinar && webinar.name) || ''} has been completed`,
              webinar: webinar.toObject(),
              slot: slot.toObject(),
              tutor: tutor.getPublicProfile(),
              // user: user.getPublicProfile(),
              reviewLink: url.resolve(process.env.userWebUrl, `users/appointments/${appointment._id}`)
            });
          slot.status = 'completed';
          await slot.save();
        }
      }
    }
  } catch (e) {
    throw e;
  }
};

exports.startMeeting = async zoomMeeting => {
  try {
    const query = {
      meetingId: zoomMeeting.id,
      status: 'pending'
    };
    const appointments = await DB.Appointment.find(query);
    if (appointments.length) {
      await Promise.all(
        appointments.map(async appointment => {
          appointment.status = 'progressing';
          const dataMeeting = await Service.ZoomUs.getDetailMeeting(zoomMeeting.id);
          appointment.dataMeeting = dataMeeting;
          appointment.meetingStart = true;
          appointment.meetingStartAt = new Date();
          await appointment.save();
          if (appointment.targetType === 'webinar') {
            const slot = await DB.Schedule.findOne({ _id: appointment.slotId });
            if (slot) {
              slot.status = 'progressing';
              await slot.save();
            }
          }
          const user = await DB.User.findOne({ _id: appointment.userId });
          const tutor = await DB.User.findOne({ _id: appointment.tutorId });
          const startTimeNow = date.formatDate(moment(), 'DD/MM/YYYY HH:mm', user.timezone || '', date.isDTS(moment(), user.timezone || ''));
          const startTimeUser = date.formatDate(
            appointment.startTime,
            'DD/MM/YYYY HH:mm',
            user.timezone || '',
            date.isDTS(appointment.startTime, user.timezone || '')
          );
          const toTimeUser = date.formatDate(
            appointment.toTime,
            'DD/MM/YYYY HH:mm',
            user.timezone || '',
            date.isDTS(appointment.toTime, user.timezone || '')
          );
          if (user.notificationSettings)
            await Service.Mailer.send('appointment/notify-meeting-start.html', user.email, {
              subject: `[Notification] Appointment #${appointment.code} has been started`,
              appointment: appointment.toObject(),
              tutor: tutor.getPublicProfile(),
              user: user.getPublicProfile(),
              startTimeNow,
              startTime: startTimeUser,
              toTime: toTimeUser
            });
        })
      );
    }
  } catch (e) {
    throw e;
  }
};

exports.endMeeting = async zoomMeeting => {
  try {
    const query = {
      meetingId: zoomMeeting.id,
      status: 'progressing'
    };
    const appointments = await DB.Appointment.find(query);
    if (appointments.length) {
      await Promise.all(
        appointments.map(async appointment => {
          // const isCompleted = await DB.Appointment.count({
          //   status: 'completed',
          //   userId: appointment.userId,
          //   tutorId: appointment.tutorId
          // });

          // if (!isCompleted) {
          //   await DB.User.update(
          //     { _id: appointment.tutorId },
          //     {
          //       $inc: { completedByLearner: 1 }
          //     }
          //   );
          // }
          appointment.status = 'completed';
          const dataMeeting = await Service.ZoomUs.getPastDetailMeeting(zoomMeeting.uuid);
          appointment.dataMeeting = dataMeeting;
          appointment.meetingEnd = true;
          appointment.meetingEndAt = new Date();
          await appointment.save();
          await DB.User.update(
            { _id: appointment.tutorId },
            {
              $inc: { completedByLearner: 1 }
            }
          );
          await this.complete(appointment);
        })
      );
    }
  } catch (e) {
    throw e;
  }
};

exports.getRecording = async (zoomMeetingId, data) => {
  try {
    const appointment = await DB.Appointment.findOne({ meetingId: zoomMeetingId });
    if (!appointment) {
      throw new Error('Appointment not found!');
    }
    const recordings = {
      shareUrl: data.share_url,
      file: data.recording_files,
      password: data.password ? data.password : ''
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

exports.isAppointment = async data => {
  try {
    const count = await DB.Appointment.count({
      userId: data.userId,
      slotId: data.slotId,
      paid: true,
      type: 'booking'
    });
    return count > 0;
  } catch (e) {
    throw e;
  }
};

exports.canReschedule = async appointment => {
  try {
    if (appointment.targetType === 'webinar') return false;
    return moment().isSameOrBefore(moment(appointment.startTime).subtract(480, 'minutes').toDate()) ? true : false;
  } catch (e) {
    throw e;
  }
};

exports.isBeforeStartTime = async appointmentId => {
  try {
    const appointment = appointmentId instanceof DB.Appointment ? appointmentId : await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return moment().isSameOrBefore(moment(appointment.startTime).subtract(10, 'minutes').toDate()) ? true : false;
  } catch (e) {
    throw e;
  }
};
