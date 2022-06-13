exports.updateReviewScoreAppointment = async (appointmentId, reviewBy) => {
  try {
    const appointment = appointmentId instanceof DB.Appointment ? appointmentId : await DB.Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found!');
    }
    const userId = reviewBy._id.toString() === appointment.tutorId.toString() ? appointment.userId : appointment.tutorId;
    const dataTutor = await DB.Review.aggregate([
      {
        $match: {
          rateTo: Helper.App.toObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          sum: { $sum: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]).exec();

    if (!dataTutor || !dataTutor.length) {
      return false;
    }

    const sum = dataTutor[0].sum;
    const count = dataTutor[0].count || 1;
    const avg = Math.round(sum / count, 2);
    await DB.User.update(
      { _id: userId },
      {
        $set: {
          ratingAvg: avg,
          totalRating: count,
          ratingScore: sum
        }
      }
    );
    if (appointment.targetType === 'webinar' && appointment.webinarId) {
      const dataWebinar = await DB.Review.aggregate([
        {
          $match: {
            webinarId: Helper.App.toObjectId(appointment.webinarId)
          }
        },
        {
          $group: {
            _id: null,
            sum: { $sum: '$rating' },
            count: { $sum: 1 }
          }
        }
      ]).exec();

      if (!dataWebinar || !dataWebinar.length) {
        return false;
      }

      const sumWebinar = dataWebinar[0].sum;
      const countWebinar = dataWebinar[0].count || 1;
      const avgWebinar = Math.round(sumWebinar / countWebinar, 2);
      await DB.Webinar.update(
        { _id: Helper.App.toObjectId(appointment.webinarId) },
        {
          $set: {
            ratingAvg: avgWebinar,
            totalRating: countWebinar,
            ratingScore: sumWebinar
          }
        }
      );
    }

    return true;
  } catch (e) {
    throw e;
  }
};

exports.updateReviewScoreCourse = async courseId => {
  try {
    const course = courseId instanceof DB.Course ? courseId : await DB.Course.findOne({ _id: courseId });
    if (!course) {
      throw new Error('Course not found!');
    }
    const userId = course.tutorId;
    const dataTutor = await DB.Review.aggregate([
      {
        $match: {
          rateTo: Helper.App.toObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          sum: { $sum: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]).exec();

    if (!dataTutor || !dataTutor.length) {
      return false;
    }

    const sum = dataTutor[0].sum;
    const count = dataTutor[0].count || 1;
    const avg = Math.round(sum / count, 2);
    await DB.User.update(
      { _id: userId },
      {
        $set: {
          ratingAvg: avg,
          totalRating: count,
          ratingScore: sum
        }
      }
    );

    const dataCourse = await DB.Review.aggregate([
      {
        $match: {
          courseId: Helper.App.toObjectId(course._id)
        }
      },
      {
        $group: {
          _id: null,
          sum: { $sum: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]).exec();

    if (!dataCourse || !dataCourse.length) {
      return false;
    }

    const sumCourse = dataCourse[0].sum;
    const countCourse = dataCourse[0].count || 1;
    const avgCourse = Math.round(sumCourse / countCourse, 2);
    await DB.Course.update(
      { _id: Helper.App.toObjectId(course._id) },
      {
        $set: {
          ratingAvg: avgCourse,
          totalRating: countCourse,
          ratingScore: sumCourse
        }
      }
    );

    return true;
  } catch (e) {
    throw e;
  }
};

exports.create = async (userId, data) => {
  try {
    const user = userId instanceof DB.User ? userId : await DB.User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const review = new DB.Review(
      Object.assign(data, {
        rateBy: user._id
      })
    );

    const appointment = await DB.Appointment.findOne({ _id: data.appointmentId });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.tutorId.toString() !== user._id.toString() && appointment.userId.toString() !== user._id.toString()) {
      throw new Error('Do not have permission on this action');
    }

    // user or tutor, allow to create just one time
    const reviewCount = await DB.Review.count({
      appointmentId: appointment._id,
      rateBy: user._id
    });
    if (reviewCount) {
      throw new Error('This action is not allowed.');
    }

    // TODO - uncomment me
    // if (appointment.status !== 'completed') {
    //   throw new Error('Invalid appointment status!');
    // }
    const notifyUserId = user._id.toString() === appointment.tutorId.toString() ? appointment.userId : appointment.tutorId;
    const field = user._id.toString() === appointment.tutorId.toString() ? 'tutorRating' : 'userRating';
    appointment[field] = data.rating;
    await appointment.save();

    review.rateTo = notifyUserId;
    await review.save();
    await Service.Review.updateReviewScoreAppointment(appointment, user);
    const template = user._id.toString() === appointment.tutorId.toString() ? 'review/new-review-user.html' : 'review/new-review-tutor.html';
    const notifyUser = await DB.User.findOne({ _id: notifyUserId });
    if (notifyUser) {
      if (notifyUser.notificationSettings)
        await Service.Mailer.send(template, notifyUser.email, {
          subject: `${user.name} rated your meeting #${appointment.code}`,
          review: review.toObject(),
          appointment: appointment.toObject(),
          rateBy: user.toObject(),
          rateTo: notifyUser.toObject(),
          appName: process.env.APP_NAME
        });
    }

    return review;
  } catch (e) {
    throw e;
  }
};

exports.reviewCourse = async (userId, data) => {
  try {
    const user = userId instanceof DB.User ? userId : await DB.User.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const review = new DB.Review(
      Object.assign(data, {
        rateBy: user._id
      })
    );

    const course = await DB.Course.findOne({ _id: data.courseId });
    if (!course) {
      throw new Error('Course not found');
    }

    // user or tutor, allow to create just one time
    const reviewCount = await DB.Review.count({
      courseId: course._id,
      rateBy: user._id
    });
    if (reviewCount) {
      throw new Error('This action is not allowed.');
    }
    const notifyUserId = course.tutorId;
    review.rateTo = notifyUserId;
    await review.save();
    await Service.Review.updateReviewScoreCourse(course, user);
    const template = user._id.toString() === course.tutorId.toString() ? 'review/new-review-user.html' : 'review/new-review-course.html';
    const notifyUser = await DB.User.findOne({ _id: Helper.App.toObjectId(notifyUserId) });
    if (notifyUser) {
      if (notifyUser.notificationSettings)
        await Service.Mailer.send(template, notifyUser.email, {
          subject: `${user.name} rated your course`,
          review: review.toObject(),
          course: course.toObject(),
          rateBy: user.toObject(),
          rateTo: notifyUser.toObject(),
          appName: process.env.APP_NAME
        });
    }

    return review;
  } catch (e) {
    throw e;
  }
};
