const moment = require('moment');
const enrollQ = require('../../webinar/queue');
const momentTimeZone = require('moment-timezone');
const date = require('../../date');
exports.canBookFree = async userId => {
  try {
    const maxFreeSlotToBook = await DB.Config.findOne({ key: 'maxFreeSlotToBook' });
    const maxFreeSlotToBookValue = maxFreeSlotToBook.value;
    const count = await DB.Appointment.count({
      userId: userId,
      isFree: true,
      status: { $ne: 'canceled' }
    });

    return count < maxFreeSlotToBookValue;
  } catch (e) {
    throw e;
  }
};

exports.canBookFreeWithTutor = async options => {
  try {
    const count = await DB.Appointment.count({
      userId: options.userId,

      tutorId: options.tutorId,
      isFree: true,
      status: { $ne: 'canceled' }
    });

    return count === 0;
  } catch (e) {
    throw e;
  }
};

exports.create = async options => {
  try {
    if (moment(options.startTime).isBefore(moment())) {
      throw new Error('Cannot book with start time in the past');
    }

    if (moment(options.startTime).isAfter(options.toTime)) {
      throw new Error('Start time cannot be over to time');
    }

    const topic = await DB.MyTopic.findOne({ _id: options.targetId });
    if (!topic) {
      throw new Error('Topic not found');
    }

    const subject = await DB.MySubject.findOne({ _id: topic.mySubjectId });
    if (!subject) {
      throw new Error('Subject not found');
    }

    const tutor = await DB.User.findOne({ _id: options.tutorId });
    if (!tutor) {
      throw new Error('Tutor not found');
    }

    const user = await DB.User.findOne({ _id: options.userId });
    if (!user) {
      throw new Error('User not found');
    }

    const availableTimeValid = await Service.AvailableTime.isValid({
      tutorId: options.tutorId,
      startTime: options.startTime,
      toTime: options.toTime,
      type: options.targetType
    });
    if (!availableTimeValid) {
      throw new Error('Tutor is not available on this time');
    }

    const canAddAppoiment = await Service.Appointment.canAdd({
      tutorId: options.tutorId,
      startTime: options.startTime,
      toTime: options.toTime
    });
    if (!canAddAppoiment) {
      throw new Error('There is a booking in this time');
    }
    // do check for free booking
    if (options.isFree && !options.couponCode) {
      //check if user can book more free trial class
      const canBookFree = await this.canBookFree(options.userId);
      if (!canBookFree) {
        throw new Error('You have taken for the maximum number of free trial classes');
      }
      // check if user have free booking with this tutor or not
      const canBookFreeWithTutor = await this.canBookFreeWithTutor(options);
      if (!canBookFreeWithTutor) {
        throw new Error('You have taken a free trial class of this tutor before');
      }
    }

    const appointment = new DB.Appointment(
      Object.assign(options, {
        description: `${user.name} booking slot of ${subject.name} with ${tutor.name}`,
        topicId: options.targetId,
        subjectId: topic.mySubjectId,
        categoryId: topic.myCategoryId,
        status: 'canceled'
      })
    );
    appointment.paid = options.isFree || false;
    const data = {
      appointmentId: appointment._id,
      name: `Book appointment with ${tutor.name}`,
      description: `${user.name} booking slot of ${subject.name} with ${tutor.name}`,
      price: topic.price || tutor.price1On1Class, // TODO - remove me
      redirectSuccessUrl: options.redirectSuccessUrl,
      cancelUrl: options.cancelUrl,
      userId: options.userId,
      targetType: options.targetType,
      target: topic,
      tutorId: tutor._id,
      couponCode: options.couponCode,
      type: 'booking'
    };

    if (!options.couponId) {
      options.couponId = null;
    }

    if (appointment.paid) {
      const transaction = new DB.Transaction({
        tutorId: tutor._id,
        userId: user._id,
        targetId: topic._id,
        description: `${user.name} booking slot of ${subject.name} with ${tutor.name}`,
        targetType: options.targetType
      });
      transaction.type = 'booking';
      transaction.price = 0;
      transaction.paid = true;
      transaction.status = 'completed';
      await transaction.save();
      appointment.transactionId = transaction._id;
      await appointment.save();
      await enrollQ.createAppointmentSolo(appointment._id);

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

      if (tutor.notificationSettings)
        await Service.Mailer.send('appointment/confirm-book-free-tutor.html', tutor.email, {
          subject: `User ${user.name} booked a slot free!`,
          tutor: tutor.getPublicProfile(),
          user: user.getPublicProfile(),
          appointment: appointment.toObject(),
          startTimeTutor,
          toTimeTutor
        });

      if (user.notificationSettings)
        await Service.Mailer.send('appointment/confirm-book-free-user.html', user.email, {
          subject: `Successfully booked 1 free slot with tutor ${tutor.name}`,
          tutor: tutor.getPublicProfile(),
          user: user.getPublicProfile(),
          appointment: appointment.toObject(),
          startTimeUser,
          toTimeUser
        });
      return transaction;
    }
    await appointment.save();

    return Service.Payment.createPaymentIntentByStripe(data);
  } catch (e) {
    throw e;
  }
};

exports.checkOverlapSlot = async options => {
  try {
    const query = {
      userId: options.userId,
      status: { $in: ['booked', 'pending'] },
      $or: [
        {
          startTime: {
            $gt: moment(options.startTime).toDate(),
            $lt: moment(options.toTime).toDate()
          }
        },
        {
          toTime: {
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
        }
      ]
    };
    const count = await DB.Appointment.count(query);
    return count > 0 ? false : true;
  } catch (e) {
    throw e;
  }
};
