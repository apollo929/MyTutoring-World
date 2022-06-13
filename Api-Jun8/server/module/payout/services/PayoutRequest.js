const moment = require('moment');

exports.calculateCurrentBalance = async tutorId => {
  try {
    const webinarBalance = await DB.Transaction.aggregate([
      {
        $match: {
          completePayout: false,
          isRefund: false,
          tutorId: Helper.App.toObjectId(tutorId),
          paid: true,
          status: 'completed',
          targetType: 'webinar'
        }
      },
      {
        $group: {
          _id: '$_id',
          balance: { $sum: '$balance' },
          commission: { $sum: '$commission' },
          total: { $sum: '$price' }
        }
      }
    ]);
    const appointments = await DB.Appointment.find({
      tutorId: Helper.App.toObjectId(tutorId),
      status: 'completed',
      targetType: 'subject',
      meetingStart: true,
      toTime: { $lte: moment().add(-3, 'days') }
    });

    const classBalance = await DB.Transaction.aggregate([
      {
        $match: {
          completePayout: false,
          tutorId: Helper.App.toObjectId(tutorId),
          status: 'completed',
          paid: true,
          targetType: 'subject',
          isRefund: false,
          _id: {
            $in: (appointments && appointments.length > 0 && appointments.map(item => item.transactionId)) || []
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          balance: { $sum: '$balance' },
          commission: { $sum: '$commission' },
          total: { $sum: '$price' }
        }
      }
    ]);

    const courseBalance = await DB.Transaction.aggregate([
      {
        $match: {
          completePayout: false,
          tutorId: Helper.App.toObjectId(tutorId),
          targetType: 'course',
          isRefund: false,
          paid: true,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$_id',
          balance: { $sum: '$balance' },
          commission: { $sum: '$commission' },
          total: { $sum: '$price' }
        }
      }
    ]);

    let commissionWebinar = 0;
    let balanceWebinar = 0;
    let totalWebinar = 0;

    let commissionSolo = 0;
    let balanceSolo = 0;
    let totalSolo = 0;

    let commissionCourse = 0;
    let balanceCourse = 0;
    let totalCourse = 0;

    let transactionIds = [];

    if (webinarBalance && webinarBalance.length > 0) {
      await Promise.all(
        webinarBalance.map(async item => {
          const countAppointment = await DB.Appointment.count({
            tutorId: Helper.App.toObjectId(tutorId),
            targetType: 'webinar',
            transactionId: Helper.App.toObjectId(item._id)
          });

          const appointments = await DB.Appointment.find({
            tutorId: Helper.App.toObjectId(tutorId),
            status: {
              $in: ['booked', 'pending', 'progressing', 'canceled', 'not-start']
            },
            targetType: 'webinar',
            transactionId: Helper.App.toObjectId(item._id)
          });

          const appointmentsIn3days = await DB.Appointment.find({
            tutorId: Helper.App.toObjectId(tutorId),
            targetType: 'webinar',
            transactionId: Helper.App.toObjectId(item._id),
            toTime: { $gt: moment().add(-3, 'days') }
          });

          if (countAppointment && !appointments.length && !appointmentsIn3days.length) {
            commissionWebinar += item.commission;
            balanceWebinar += item.balance;
            totalWebinar += item.total;
            transactionIds.push(item._id);
          }
        })
      );
    }

    if (classBalance && classBalance.length > 0) {
      await Promise.all(
        classBalance.map(item => {
          commissionSolo += item.commission;
          balanceSolo += item.balance;
          totalSolo += item.total;
          transactionIds.push(item._id);
        })
      );
    }

    if (courseBalance && courseBalance.length > 0) {
      await Promise.all(
        courseBalance.map(item => {
          commissionCourse += item.commission;
          balanceCourse += item.balance;
          totalCourse += item.total;
          transactionIds.push(item._id);
        })
      );
    }
    return {
      transactionIds: transactionIds,
      commission: commissionWebinar + commissionSolo + commissionCourse,
      balance: balanceWebinar + balanceSolo + balanceCourse,
      total: totalWebinar + totalSolo + totalCourse
    };
  } catch (e) {
    throw e;
  }
};

exports.getTransactionForPayout = async (tutorId, transactionIds) => {
  try {
    return DB.Transaction.find({
      completePayout: false,
      tutorId: Helper.App.toObjectId(tutorId),
      _id: { $in: transactionIds }
    });
  } catch (e) {
    throw e;
  }
};

exports.sendRequest = async (tutorId, payoutAccount) => {
  try {
    const tutor = await DB.User.findOne({ _id: tutorId });
    if (!tutor) {
      throw new Error('Tutor not found!');
    }

    const payoutRequests = await DB.PayoutRequest.find({
      tutorId
    }).sort({ updatedAt: -1 });

    // if last previous request is still pending, we will alert to admin
    let payoutRequest;
    if (payoutRequests && payoutRequests.length) {
      payoutRequest = payoutRequests[0];
    }
    if (payoutRequest) {
      if (moment(payoutRequest.updatedAt).isSame(moment(), 'day')) {
        if (payoutRequest.requestAttempts >= process.env.MAX_PAYOUT_REQUEST_PER_DAY) {
          throw new Error('Send request reach max attempts today');
        } else {
          payoutRequest.requestAttempts++;
        }
      } else {
        payoutRequest.requestAttempts = 1;
      }
      if (payoutRequest.status !== 'pending') payoutRequest = null;
    }
    if (!payoutRequest) {
      payoutRequest = new DB.PayoutRequest({
        tutorId
      });
    }

    const balance = await this.calculateCurrentBalance(tutorId);
    if (!balance.balance) {
      throw new Error('Balance is not enough for payout request');
    }
    // create appointment items on this time frame
    const transactions = await this.getTransactionForPayout(tutorId, balance.transactionIds);
    if (!transactions.length) {
      throw new Error('Balance is not enough for payout request');
    }
    payoutRequest.requestToTime = new Date();
    payoutRequest.total = balance.total;
    payoutRequest.commission = balance.commission;
    payoutRequest.balance = balance.balance;
    payoutRequest.payoutAccount = payoutAccount;
    payoutRequest.details = balance;

    await payoutRequest.save();
    // remove previous item then update to this new
    await DB.PayoutItem.remove({ requestId: payoutRequest._id });
    await Promise.all(
      transactions.map(transaction => {
        const payoutItem = new DB.PayoutItem({
          requestId: payoutRequest._id,
          itemType: 'transaction',
          itemId: transaction._id,
          total: transaction.usedCoupon ? transaction.discountPrice : transaction.price,
          commission: transaction.commission,
          balance: transaction.balance,
          tutorId: transaction.tutorId
        });
        return payoutItem.save();
      })
    );

    // send email to admin
    await Service.Mailer.send('payout/request-to-admin.html', process.env.EMAIL_NOTIFICATION_PAYOUT_REQUEST, {
      subject: `Payment request from ${tutor.name}`,
      tutor: tutor.toObject(),
      transactions,
      payoutRequest
    });
    return payoutRequest;
  } catch (e) {
    throw e;
  }
};

exports.approveRequest = async (requestId, options) => {
  try {
    const payoutRequest = requestId instanceof DB.PayoutRequest ? requestId : await DB.PayoutRequest.findOne({ _id: requestId });
    if (!payoutRequest) {
      throw new Error('Request not found');
    }

    if (payoutRequest.status === 'approved') {
      throw new Error('Payout request status is invalid');
    }

    payoutRequest.status = 'approved';
    if (options.note) {
      payoutRequest.note = options.note;
    }
    await payoutRequest.save();
    await DB.PayoutItem.updateMany(
      { requestId: payoutRequest._id },
      {
        status: 'approved'
      }
    );
    const payoutItems = await DB.PayoutItem.find({ requestId: payoutRequest._id });
    await Promise.all(
      payoutItems.map(payoutItem =>
        DB.Transaction.update(
          { _id: payoutItem.itemId },
          {
            $set: {
              completePayout: true,
              payoutRequestId: payoutItem.requestId
            }
          }
        )
      )
    );
    const tutor = await DB.User.findOne({ _id: payoutRequest.tutorId });
    if (tutor.notificationSettings)
      await Service.Mailer.send('payout/approve-notify-to-tutor.html', tutor.email, {
        subject: `Payment request #${payoutRequest.code} has been approved`,
        tutor: tutor.toObject(),
        payoutRequest
      });
    return payoutRequest;
  } catch (e) {
    throw e;
  }
};

exports.rejectRequest = async (requestId, options) => {
  try {
    const payoutRequest = requestId instanceof DB.PayoutRequest ? requestId : await DB.PayoutRequest.findOne({ _id: requestId });
    if (!payoutRequest) {
      throw new Error('Request not found');
    }

    if (payoutRequest.status === 'approved') {
      throw new Error('Payout request status is invalid');
    }

    payoutRequest.status = 'rejected';
    if (options.rejectReason) {
      payoutRequest.rejectReason = options.rejectReason;
    }
    if (options.note) {
      payoutRequest.note = options.note;
    }
    await payoutRequest.save();
    await DB.PayoutItem.updateMany(
      { requestId: payoutRequest._id },
      {
        status: 'rejected'
      }
    );
    const tutor = await DB.User.findOne({ _id: payoutRequest.tutorId });
    if (tutor.notificationSettings)
      await Service.Mailer.send('payout/reject-notify-to-tutor.html', tutor.email, {
        subject: `Payment request #${payoutRequest.code} was rejected`,
        tutor: tutor.toObject(),
        payoutRequest
      });
    return payoutRequest;
  } catch (e) {
    throw e;
  }
};

exports.getItemDetails = async requestId => {
  try {
    const items = await DB.PayoutItem.find({ requestId });
    // just support appointment for now
    return Promise.all(
      items.map(item =>
        DB.Appointment.findOne({
          _id: item.itemId
        })
          .populate('tutor')
          .populate('user')
          .populate('subject')
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.stats = async options => {
  try {
    const matchQuery = {};
    if (options.tutorId) {
      matchQuery.tutorId = Helper.App.toObjectId(options.tutorId);
    }
    if (options.startDate && options.toDate) {
      matchQuery.requestToTime = {
        $gte: moment(options.startDate).startOf('day').toDate(),
        $lte: moment(options.toDate).endOf('day').toDate()
      };
    }

    const pendingRequest = await DB.PayoutRequest.aggregate([
      {
        $match: Object.assign(
          {
            status: 'pending'
          },
          matchQuery
        )
      },
      {
        $group: {
          _id: null,
          balance: { $sum: '$balance' },
          commission: { $sum: '$commission' },
          total: { $sum: '$total' }
        }
      }
    ]);
    const approvedRequest = await DB.PayoutRequest.aggregate([
      {
        $match: Object.assign(
          {
            status: 'approved'
          },
          matchQuery
        )
      },
      {
        $group: {
          _id: null,
          balance: { $sum: '$balance' },
          commission: { $sum: '$commission' },
          total: { $sum: '$total' }
        }
      }
    ]);

    return {
      pending: {
        balance: pendingRequest && pendingRequest.length ? pendingRequest[0].balance : 0,
        commission: pendingRequest && pendingRequest.length ? pendingRequest[0].commission : 0,
        total: pendingRequest && pendingRequest.length ? pendingRequest[0].total : 0
      },
      approved: {
        balance: approvedRequest && approvedRequest.length ? approvedRequest[0].balance : 0,
        commission: approvedRequest && approvedRequest.length ? approvedRequest[0].commission : 0,
        total: approvedRequest && approvedRequest.length ? approvedRequest[0].total : 0
      }
    };
  } catch (e) {
    throw e;
  }
};
