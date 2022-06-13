const moment = require('moment');
const momentTimeZone = require('moment-timezone');
exports.sendRequest = async (userId, options) => {
  try {
    const transaction = await DB.Transaction.findOne({
      _id: options.transactionId
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (!transaction.paid) {
      throw new Error('Transaction not completed');
    }

    if (transaction.status === 'pending-refund' || transaction.status === 'approved-refund' || transaction.status === 'refunded') {
      throw new Error('The request cannot be executed, the transaction is pending or has been processed');
    }

    const tutor = await DB.User.findOne({ _id: transaction.tutorId });
    if (!tutor) {
      throw new Error('Tutor not found');
    }

    const user = await DB.User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    const request = await DB.RefundRequest.findOne({
      transactionId: options.transactionId,
      status: { $in: ['requested', 'pending', 'approved', 'refunded'] }
    });
    if (request) {
      const message =
        request.status === 'approved'
          ? 'This request is approved, please wait for admin transfer money!'
          : request.status === 'refunded'
          ? 'This request has refunded money!'
          : 'You have already sent a request for this appointment. Please wait for confirmation from admin!';
      throw new Error(message);
    }
    if (options.type === 'before' && (options.targetType === 'webinar' || options.targetType === 'subject')) {
      const appointments = await DB.Appointment.find({ transactionId: options.transactionId })
        .sort({
          startTime: 1
        })
        .skip(0)
        .limit(1000)
        .exec();
      const firstAppointment = appointments && appointments.length ? appointments[0] : null;
      if (!firstAppointment) {
        throw new Error('There have been no appointments created from this transaction yet');
      }
      const isBefore = moment().isSameOrBefore(
        moment(firstAppointment.startTime)
          .add(-1 * 1440, 'minutes')
          .toDate()
      );
      if (!isBefore) {
        throw new Error(
          `Can't request, your first appointment will start at ${
            user.timezone
              ? momentTimeZone(firstAppointment.startTime).tz(user.timezone).format('DD/MM/YYYY HH:mm')
              : moment(firstAppointment.startTime).format('DD/MM/YYYY HH:mm')
          },
          please request 24 hours in advance before the first slot of the webinar begins`
        );
      }
    } else if (options.type === 'after' && (options.targetType === 'webinar' || options.targetType === 'subject')) {
      const appointments = await DB.Appointment.find({ transactionId: options.transactionId })
        .sort({
          startTime: 1
        })
        .skip(0)
        .limit(1000)
        .exec();
      const lastAppointment = appointments && appointments.length ? appointments[appointments.length - 1] : null;
      if (!lastAppointment) {
        throw new Error('There have been no appointments created from this transaction yet');
      }
      const isAfter = moment().isSameOrAfter(moment(lastAppointment.toTime).toDate());
      if (!isAfter) {
        throw new Error('Appointment is not completed. Please send a request once the appointment is completed');
      }

      const isAfter3days = moment().isSameOrAfter(moment(lastAppointment.toTime).add(3, 'days').toDate());
      if (isAfter3days) throw new Error('Request failed. You can only send a refund request within 3 days after the class is completed.');
    }
    const refundRequest = new DB.RefundRequest({
      userId,
      transactionId: transaction._id,
      amount: transaction && transaction.usedCoupon ? transaction.discountPrice : transaction.price,
      reason: options.reason || '',
      transactionId: transaction._id,
      type: options.type,
      targetType: options.targetType || '',
      tutorId: transaction.tutorId,
      targetId: transaction.targetId || null
    });
    transaction.isRefund = true;
    transaction.status = 'pending-refund';
    await transaction.save();
    await refundRequest.save();
    await Service.Mailer.send('refund/request-to-admin.html', process.env.EMAIL_NOTIFICATION_PAYOUT_REQUEST, {
      subject: `Refund request from ${user.name}`,
      user: user.toObject(),
      transaction: transaction.toObject(),
      refundRequest
    });

    if (tutor.notificationSettings)
      await Service.Mailer.send('refund/request-notify-to-tutor.html', tutor.email, {
        subject: `Refund request from ${user.name}`,
        user: user.getPublicProfile(),
        tutor: tutor.getPublicProfile(),
        transaction: transaction.toObject(),
        refundRequest: refundRequest.toObject()
      });

    return refundRequest;
  } catch (e) {
    throw e;
  }
};

exports.approveRequest = async (refundRequest, options) => {
  try {
    if (refundRequest.status === 'approved' || refundRequest.status === 'rejected') {
      throw new Error('Refund request status is invalid');
    }
    refundRequest.status = 'approved';
    if (options.note) {
      refundRequest.note = options.note;
    }
    await refundRequest.save();
    // await DB.Transaction.update(
    //   { _id: refundRequest.transactionId },
    //   {
    //     $set: { isRefund: true }
    //   }
    // );

    const user = await DB.User.findOne({ _id: refundRequest.userId });
    const tutor = await DB.User.findOne({ _id: refundRequest.tutorId });
    const transaction = await DB.Transaction.findOne({ _id: refundRequest.transactionId });
    transaction.isRefund = true;
    transaction.status = 'approved-refund';
    await transaction.save();
    const appointments = await DB.Appointment.find({ transactionId: transaction._id });
    if (appointments && appointments.length > 0) {
      Promise.all(
        appointments.map(async appointment => {
          appointment.status = 'canceled';
          appointment.zoomData = null;
          await appointment.save();
        })
      );
    }

    if (user.notificationSettings)
      await Service.Mailer.send('refund/approve-notify-to-user.html', user.email, {
        subject: `Refund request #${refundRequest.code} has been approved`,
        user: user.toObject(),
        refundRequest
      });

    if (tutor.notificationSettings)
      await Service.Mailer.send('refund/approve-notify-to-tutor.html', tutor.email, {
        subject: `Approved a refund request ${transaction.code}`,
        user: user.toObject(),
        tutor: tutor.toObject(),
        refundRequest,
        transaction: transaction.toObject()
      });
    return refundRequest;
  } catch (e) {
    throw e;
  }
};

exports.rejectRequest = async (refundRequest, options) => {
  try {
    if (refundRequest.status === 'approved' || refundRequest.status === 'rejected') {
      throw new Error('Refund request status is invalid');
    }
    refundRequest.status = 'rejected';
    if (options.rejectReason) {
      refundRequest.rejectReason = options.rejectReason;
    }
    if (options.note) {
      refundRequest.note = options.note;
    }
    await refundRequest.save();
    await DB.Transaction.update(
      { _id: refundRequest.transactionId },
      {
        $set: { isRefund: false, status: 'completed' }
      }
    );

    const user = await DB.User.findOne({ _id: refundRequest.userId });

    if (user.notificationSettings)
      await Service.Mailer.send('refund/reject-notify-to-user.html', user.email, {
        subject: `Payment request #${refundRequest.code} has been rejected`,
        user: user.toObject(),
        refundRequest
      });
    return refundRequest;
  } catch (e) {
    throw e;
  }
};

exports.confirmRefunded = async (refundRequest, options) => {
  try {
    if (refundRequest.status === 'rejected' || refundRequest.status === 'pending') {
      throw new Error('Refund request status is invalid');
    }
    refundRequest.status = 'refunded';
    await refundRequest.save();
    const transaction = await DB.Transaction.findOne({ _id: refundRequest.transactionId });
    transaction.isRefund = true;
    transaction.status = 'refunded';
    await transaction.save();
    if (transaction.targetType === 'course') {
      const myCourse = await DB.MyCourse.findOne({
        courseId: transaction.targetId,
        userId: transaction.userId
      });
      if (myCourse) {
        await myCourse.remove();
      }
    }
    // await DB.Transaction.update(
    //   { _id: refundRequest.transactionId },
    //   {
    //     $set: { isRefund: true, status: 'refunded' }
    //   }
    // );
    const user = await DB.User.findOne({ _id: refundRequest.userId });
    if (user.notificationSettings)
      await Service.Mailer.send('refund/refund-notify-to-user.html', user.email, {
        subject: `Refund #${refundRequest.code} to you`,
        user: user.toObject(),
        refundRequest
      });
    return refundRequest;
  } catch (e) {
    throw e;
  }
};
