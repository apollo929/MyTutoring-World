exports.isUsedCoupon = async options => {
  const coupon = options.couponId instanceof DB.Coupon ? options.couponId : await DB.Coupon.findOne({ _id: options.couponId });
  // const coupon = await DB.Coupon.findOne({ _id: options.couponId });
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  const query = {
    userId: options.userId,
    couponCode: coupon.code,
    paid: true,
    tutorId: coupon.tutorId,
    targetType: coupon.targetType
  };

  if (coupon.targetType === 'course') query.targetId = coupon.courseId;
  if (coupon.targetType === 'webinar') query.targetId = coupon.webinarId;

  const count = await DB.Transaction.count(query);

  return count > 0;
};

exports.calculate = async options => {
  const coupon = options.couponId instanceof DB.Coupon ? options.couponId : await DB.Coupon.findOne({ _id: options.couponId });
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  const dataDiscount = {};
  if (coupon.type === 'percent') {
    dataDiscount.discountAmount = options.price * (coupon.value / 100);
    dataDiscount.discountPrice = options.price - options.price * (coupon.value / 100);
  } else {
    dataDiscount.discountAmount = options.price * (coupon.value / 100);
    dataDiscount.discountPrice = options.price - coupon.value;
  }
  return dataDiscount;
};
