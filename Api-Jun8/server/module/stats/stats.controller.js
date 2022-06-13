exports.stats = async (req, res, next) => {
  try {
    const totalStudents = await DB.User.count({
      role: 'user',
      type: 'student'
      // emailVerified: true
    });

    const totalTutors = await DB.User.count({
      role: 'user',
      type: 'tutor'
      // emailVerified: true
    });

    const totalTutorPendingApproved = await DB.User.count({
      role: 'user',
      type: 'tutor',
      emailVerified: true,
      rejected: true
    });

    const payoutRequestPendingByTutor = await DB.PayoutRequest.aggregate([
      {
        $match: {
          status: 'pending'
        }
      },
      {
        $group: {
          _id: '$_id',
          total: { $sum: '$balance' }
        }
      }
    ]);

    const totalWebinars = await DB.Webinar.count({
      isOpen: true
    });

    const totalPricePaidByUser = await DB.Transaction.aggregate([
      {
        $match: {
          isRefund: false,
          paid: true
        }
      },
      {
        $group: {
          _id: '$_id',
          total: { $sum: '$price' }
        }
      }
    ]);

    let totalRevenue = 0;
    let payoutRequestPending = 0;
    if (totalPricePaidByUser && totalPricePaidByUser.length) {
      totalPricePaidByUser.map(item => {
        totalRevenue += item.total;
      });
    }
    if (payoutRequestPendingByTutor && payoutRequestPendingByTutor.length) {
      payoutRequestPendingByTutor.map(item => {
        payoutRequestPending += item.total;
      });
    }

    res.locals.stats = {
      totalStudents,
      totalTutors,
      totalTutorPendingApproved,
      payoutRequestPending,
      totalWebinars,
      totalRevenue
    };
    return next();
  } catch (e) {
    return next();
  }
};
