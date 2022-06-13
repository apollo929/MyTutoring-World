const Queue = require('../../kernel/services/queue');
const enrollQ = Queue.create(`webinar_queue`);
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const date = require('../date');
enrollQ.process(async (job, done) => {
  const data = job.data.data;
  const command = job.data.command;
  try {
    if (command === 'new-booking-webinar') {
      const query = {
        webinarId: data.targetId,
        $or: [{ status: 'scheduled' }, { status: 'pending' }]
      };
      const slots = await DB.Schedule.find(query);
      if (slots.length) {
        await Promise.all(
          slots.map(async slot => {
            if (moment(data.createdAt).isBefore(moment(slot.startTime).add(-1 * 30, 'minutes'))) {
              const tutor = await DB.User.findOne({ _id: slot.tutorId });
              if (!tutor) {
                throw new Error('Cannot found tutor');
              }
              const user = await DB.User.findOne({ _id: data.userId });
              if (!user) {
                throw new Error('Cannot found user');
              }
              const webinar = await DB.Webinar.findOne({ _id: slot.webinarId });
              if (!webinar) {
                throw new Error('Cannot found webinar');
              }
              const countAppointment = await DB.Appointment.findOne({
                userId: data.userId,
                slotId: slot._id,
                targetType: 'webinar',
                webinarId: webinar._id,
                tutorId: data.tutorId
              });
              if (!countAppointment) {
                const appointment = new DB.Appointment({
                  tutorId: tutor._id,
                  userId: data.userId,
                  slotId: slot._id,
                  webinarId: webinar._id,
                  // zoomData: slot.zoomData,
                  startTime: slot.startTime,
                  toTime: slot.toTime,
                  displayStartTime: slot.displayStartTime,
                  displayToTime: slot.displayToTime,
                  // meetingId: slot.zoomData.id,
                  transactionId: data._id,
                  targetType: data.targetType,
                  paid: data.paid || false,
                  status: 'booked',
                  description: `Appointment ${webinar.name} ${user.name} with ${tutor.name}`
                });
                await appointment.save();
              }
            }
          })
        );
      }
    } else if (command === 'new-gift') {
      const transactions = await DB.Transaction.find({
        emailRecipient: data.emailRecipient,
        paid: true,
        type: 'gift',
        targetType: 'webinar'
      });
      const user = await DB.User.findOne({ email: data.emailRecipient });
      if (transactions.length && user) {
        await Promise.all(
          transactions.map(async transaction => {
            const tutor = await DB.User.findOne({ _id: transaction.tutorId });
            if (!tutor) {
              throw new Error('Tutor not found');
            }
            const webinar = await DB.Webinar.findOne({ _id: transaction.targetId, isOpen: true });
            if (!webinar) {
              throw new Error('Cannot found webinar or webinar is closed');
            }

            const slots = await DB.Schedule.find({
              webinarId: webinar._id,
              $or: [{ status: 'scheduled' }, { status: 'pending' }]
            });
            if (slots.length) {
              await Promise.all(
                slots.map(async slot => {
                  if (moment(data.createdAt).isBefore(moment(slot.startTime).add(-1 * 30, 'minutes'))) {
                    const countAppointment = await DB.Appointment.count({
                      userId: user._id,
                      slotId: slot._id
                    });
                    if (!countAppointment) {
                      const appointment = new DB.Appointment({
                        userId: user._id,
                        slotId: slot._id,
                        webinarId: webinar._id,
                        transactionId: transaction._id,
                        type: transaction.type,
                        displayStartTime: slot.displayStartTime,
                        displayToTime: slot.displayToTime,
                        // zoomData: slot.zoomData,
                        startTime: slot.startTime,
                        toTime: slot.toTime,
                        // meetingId: slot.zoomData.id,
                        tutorId: tutor._id,
                        paid: true,
                        status: 'booked',
                        targetType: transaction.targetType,
                        description: `Appointment ${webinar.name} ${user.name} with ${tutor.name}`
                      });
                      await appointment.save();
                    }
                  }
                })
              );
              await DB.Webinar.update(
                { _id: transaction.targetId },
                {
                  $inc: {
                    numberParticipants: 1
                  }
                }
              );
              transaction.idRecipient = user._id;
              await transaction.save();
            }
          })
        );
      }
    } else if (command === 'new-gift-course') {
      const transactions = await DB.Transaction.find({
        emailRecipient: data.emailRecipient,
        paid: true,
        type: 'gift',
        targetType: 'course'
      });
      const user = await DB.User.findOne({ email: data.emailRecipient });
      if (transactions.length && user) {
        await Promise.all(
          transactions.map(async transaction => {
            const course = await DB.Course.findOne({ _id: transaction.targetId });
            if (course) {
              const myCourse = new DB.MyCourse({
                courseId: transaction.targetId,
                userId: user._id,
                transactionId: transaction._id,
                name: course.name,
                categoryIds: course.categoryIds,
                paid: true
              });
              await myCourse.save();
            }
          })
        );
      }
    } else if (command === 'new-booking-class') {
      const appointment = await DB.Appointment.findOne({ _id: data.appointmentId });
      const tutor = await DB.User.findOne({ _id: appointment.tutorId });
      if (!tutor) {
        return;
      }

      if (appointment) {
        appointment.status = 'booked';
        await appointment.save();
        const transaction = await DB.Transaction.findOne({
          _id: appointment.transactionId
        });
        const user = await DB.User.findOne({ _id: appointment.userId });
        const topic = await DB.MyTopic.findOne({ _id: appointment.topicId });
        if (!topic) throw new Error('Topic not found');
        // const subject = await DB.MySubject.findOne({ _id: appointment.subjectId || transaction.subjectId });
        // if (!subject) {
        //   throw new Error('Subject not found');
        // }
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
          await Service.Mailer.send('appointment/notify-tutor-new-booking.html', tutor.email, {
            subject: `New user booking with you!`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            transaction: transaction.toObject(),
            appointment: appointment.toObject(),
            topic: topic.toObject(),
            startTime: startTimeTutor,
            toTime: toTimeTutor
          });
      }
    } else if (command === 'reschedule-class') {
      const appointment = await DB.Appointment.findOne({ _id: data.appointmentId });
      const tutor = await DB.User.findOne({ _id: appointment.tutorId });
      if (!tutor) {
        return;
      }
      if (appointment) {
        const user = await DB.User.findOne({ _id: appointment.userId });
        const subject = await DB.MySubject.findOne({ _id: appointment.subjectId });
        if (!subject) {
          throw new Error('Subject not found');
        }
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
          await Service.Mailer.send('appointment/notification-reschedule-tutor.html', tutor.email, {
            subject: `Reschedule class notification!`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            appointment: appointment.toObject(),
            subjects: subject.toObject(),
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
          await Service.Mailer.send('appointment/notification-reschedule-user.html', user.email, {
            subject: `Reschedule class successfully!`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            appointment: appointment.toObject(),
            subjects: subject.toObject(),
            startTime: startTimeUser,
            toTime: toTimeUser
          });
      }
    }

    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      error: e,
      path: 'webinar-error'
    });
    done();
  }
});

exports.createAppointment = transaction =>
  enrollQ
    .createJob({
      command: 'new-booking-webinar',
      data: transaction
    })
    .save();

exports.createAppointmentWithNewSlot = (transaction, slotId) =>
  enrollQ
    .createJob({
      command: 'new-slot',
      data: {
        transaction,
        slotId
      }
    })
    .save();
exports.createAppointmentWithEmailRecipient = emailRecipient =>
  enrollQ
    .createJob({
      command: 'new-gift',
      data: {
        emailRecipient
      }
    })
    .save();
exports.createMyCourseWithEmailRecipient = (emailRecipient, courseId) =>
  enrollQ
    .createJob({
      command: 'new-gift-course',
      data: {
        emailRecipient
      }
    })
    .save();
exports.createAppointmentSolo = appointmentId =>
  enrollQ
    .createJob({
      command: 'new-booking-class',
      data: {
        appointmentId
      }
    })
    .save();
exports.rescheduleClass = appointmentId =>
  enrollQ
    .createJob({
      command: 'reschedule-class',
      data: {
        appointmentId
      }
    })
    .save();
