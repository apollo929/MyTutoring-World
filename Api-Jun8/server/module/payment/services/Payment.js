const url = require('url');
const enrollQ = require('../../webinar/queue');
exports.getRedirect = async options => {
  try {
    const transaction = new DB.Transaction({
      webinarId: options.webinarId
    });
    transaction.type = options.type;
    transaction.paymentGateway = 'paydunya';
    transaction.price = options.price;
    transaction.userId = options.userId;
    transaction.tutorId = options.tutorId;
    transaction.transactionId = options.transactionId;

    // create transaction and do redirect here
    const paymentData = await Service.Paydunya.doCheckout({
      name: options.name,
      description: options.description,
      totalAmount: options.price,
      totalPrice: options.price,
      unitPrice: options.price,
      quantity: 1,
      redirectSuccessUrl: options.redirectSuccessUrl,
      cancelUrl: options.cancelUrl,
      transactionId: transaction._id
    });
    transaction.paymentToken = paymentData.token;
    await transaction.save();
    return paymentData;
  } catch (e) {
    throw e;
  }
};

exports.createPaymentIntentByStripe = async options => {
  try {
    // let price = options.price;
    let priceForPayment = options.price;
    if ((options.targetType === 'course' || options.targetType === 'webinar') && options.target.isFree) {
      priceForPayment = 0;
    }
    const transaction = new DB.Transaction({
      tutorId: options.tutorId,
      userId: options.userId,
      targetId: options.target._id,
      description: options.description,
      targetType: options.targetType,
      originalPrice: options.price,
      emailRecipient: options.emailRecipient || ''
    });
    transaction.type = options.type;
    transaction.paymentGateway = 'stripe';
    if (options.couponCode) {
      const query = {
        code: options.couponCode,
        targetType: options.targetType
      };
      if (options.targetType === 'course') {
        query.courseId = options.target._id;
      } else if (options.targetType === 'webinar') {
        query.webinarId = options.target._id;
      } else {
        query.targetType = 'subject';
        query.tutorId = options.tutorId;
      }
      const coupon = await DB.Coupon.findOne(query);

      if (!coupon) {
        throw new Error('Coupon not found!');
      }
      const count = await DB.Transaction.count({
        couponCode: coupon.code,
        paid: true
      });

      if (count >= coupon.limitNumberOfUse) {
        throw new Error('Coupon has expired');
      }

      if (
        (options.targetType === 'webinar' && coupon.webinarId.toString() !== options.target._id.toString()) ||
        (options.targetType === 'course' && coupon.courseId.toString() !== options.target._id.toString()) ||
        (options.targetType === 'subject' && coupon.tutorId.toString() !== options.tutorId.toString())
      ) {
        throw new Error('Coupon not found');
      }
      const isUsedCoupon = await Service.Coupon.isUsedCoupon({
        couponId: coupon,
        userId: options.userId
      });
      if (!isUsedCoupon) {
        const dataDiscount = await Service.Coupon.calculate({
          price: options.price,
          couponId: coupon
        });
        transaction.discountPrice = dataDiscount.discountPrice;
        transaction.discountAmount = dataDiscount.discountAmount;
        transaction.discountValue = coupon.value;
        transaction.couponInfo = {
          couponCode: coupon.code,
          couponId: coupon._id,
          discountAmount: dataDiscount.discountAmount,
          discountPrice: dataDiscount.discountPrice,
          discountValue: coupon.value,
          type: coupon.type
        };
        transaction.couponCode = coupon.code;
        transaction.usedCoupon = true;
        priceForPayment = dataDiscount.discountPrice;
      } else {
        throw new Error('You used this coupon code!');
      }
    }
    transaction.price = priceForPayment;
    let applicationFee = 0.053;
    if (priceForPayment > 0) {
      const config = await DB.Config.findOne({ key: applicationFee });
      if (config && config.value) {
        applicationFee = config.value;
        if (applicationFee > 1) {
          if (applicationFee > 100) {
            applicationFee = 100;
          }
          applicationFee = applicationFee / 100;
        }
        transaction.applicationFee = transaction.price * applicationFee;
      }
    }
    if (options.appointmentId) {
      await DB.Appointment.update(
        { _id: options.appointmentId },
        {
          $set: { transactionId: transaction._id }
        }
      );
    }
    if (priceForPayment <= 0) {
      await transaction.save();
      return this.updatePayment(transaction);
    }
    const paymentData = await Service.Stripe.createPaymentIntent(
      Object.assign(transaction, { description: options.description, priceForPayment, applicationFee: transaction.price * applicationFee })
    );
    transaction.stripeClientSecret = paymentData && paymentData.client_secret ? paymentData.client_secret : '';
    await transaction.save();
    return transaction;
  } catch (e) {
    throw e;
  }
};

exports.updatePayment = async transactionId => {
  try {
    const transaction = transactionId instanceof DB.Transaction ? transactionId : await DB.Transaction.findOne({ _id: transactionId });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    let checking;
    const paymentInfo = transaction.paymentInfo;
    if (process.env.PAYMENT_SERVICE === 'paydunya') {
      checking = await Service.Paydunya.checking(transaction.paymentToken);
      transaction.paymentInfo = checking;
    } else if (process.env.PAYMENT_SERVICE === 'stripe') {
      checking = {
        status:
          (paymentInfo && paymentInfo.paid) ||
          (transaction.usedCoupon && transaction.discountPrice <= 0) ||
          transaction.price <= 0 ||
          process.env.PAYMENT_MODE === 'test'
            ? 'completed'
            : 'failed'
      };
    }
    transaction.status = checking.status;
    transaction.paid = checking.status === 'completed' ? true : false;
    await transaction.save();
    // update booking info
    if (transaction.status === 'completed') {
      const user = await DB.User.findOne({ _id: transaction.userId });
      const tutor = await DB.User.findOne({ _id: transaction.tutorId });
      let commissionRate = process.env.COMMISSION_RATE;
      const config = await DB.Config.findOne({
        key: 'commissionRate'
      });
      if (config) {
        commissionRate = config.value;
      }
      if (commissionRate > 1) {
        if (commissionRate > 100) {
          commissionRate = 100;
        }
        commissionRate = commissionRate / 100;
      }
      const price = transaction.price;
      const commission = price * (tutor.commissionRate ? tutor.commissionRate : commissionRate);
      const balance = price - commission;

      await DB.Transaction.update(
        { _id: transaction._id },
        {
          $set: {
            price,
            commission,
            balance
          }
        }
      );

      if (transaction.targetType === 'subject') {
        const appointment = await DB.Appointment.findOne({ transactionId: transaction._id });
        appointment.paid = checking.status === 'completed' ? true : false;
        await appointment.save();
        await enrollQ.createAppointmentSolo(appointment._id);
      }
      // const webinar = await DB.Webinar.findOne({ _id: transaction.webinarId });
      let webinar = null;
      let course = null;
      if (transaction.targetType === 'webinar') {
        webinar = await DB.Webinar.findOne({ _id: transaction.targetId });
      } else if (transaction.targetType === 'course') {
        course = await DB.Course.findOne({ _id: transaction.targetId });
      }
      const currencySymbol = await DB.Config.findOne({ key: 'currencySymbol' });
      if (transaction.targetType === 'webinar' && transaction.type === 'booking' && webinar) {
        await enrollQ.createAppointment(transaction);
        await DB.Webinar.update(
          { _id: transaction.targetId },
          {
            $inc: {
              numberParticipants: 1
            }
          }
        );

        if (tutor.notificationSettings)
          await Service.Mailer.send('appointment/notify-tutor-new-booking.html', tutor.email, {
            subject: `New user booking with you!`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            transaction: transaction.toObject(),
            webinar: webinar.toObject(),
            currencySymbol: currencySymbol ? currencySymbol.value : '$'
          });
      } else if (transaction.targetType === 'course' && course && transaction.type === 'booking') {
        // const course = await DB.Course.findOne({ _id: transaction.courseId });
        const myCourse = new DB.MyCourse({
          courseId: transaction.targetId,
          userId: transaction.userId,
          transactionId: transaction._id,
          name: course.name,
          categoryIds: course.categoryIds,
          paid: true
        });
        await myCourse.save();
      }

      if (user && tutor) {
        if (user.notificationSettings)
          await Service.Mailer.send('payment/book-appointment-success.html', user.email, {
            subject: `Payment successfully made for the reservation #${transaction.code}`,
            user: user.getPublicProfile(),
            transaction: transaction.toObject(),
            transaction: transaction.toObject(),
            currencySymbol: currencySymbol ? currencySymbol.value : '$'
          });
        if (transaction.type === 'gift') {
          await Service.Mailer.send('appointment/send-gift.html', transaction.emailRecipient, {
            subject: `${user.name} gave you a gift`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            transaction: transaction.toObject(),
            webinar: (webinar && webinar.toObject()) || null,
            course: (course && course.toObject()) || null,
            signupLink: url.resolve(process.env.userWebUrl, '/auth/signup'),
            appName: process.env.APP_NAME
          });
          if (transaction.targetType === 'webinar') {
            await enrollQ.createAppointmentWithEmailRecipient(transaction.emailRecipient);
          } else if (transaction.targetType === 'course' && course) {
            await enrollQ.createMyCourseWithEmailRecipient(transaction.emailRecipient);
          }
        }
      }
    }

    return transaction;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.isBooked = async (items, userId) => {
  return items.length
    ? await Promise.all(
        items.map(async item => {
          if (item.course) {
            item = item.toObject();
            item.course.isFavorite = true;
            item.course.booked = true;
            const progress = await DB.Progress.findOne({ userId: item.userId, courseId: item.course._id });
            if (progress) {
              item.course.progress = progress.progressValue;
            } else {
              item.course.progress = 0;
            }
            return item.course;
          }
        })
      )
    : [];
};
