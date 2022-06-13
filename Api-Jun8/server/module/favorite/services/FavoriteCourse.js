exports.favorite = async (userId, options) => {
  const course = await DB.Course.findOne({ _id: options.courseId });
  if (!course) {
    throw new Error('Course not found');
  }
  const user = await DB.User.findOne({ _id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  let favorite = await DB.Favorite.findOne({ courseId: options.courseId, userId });
  if (!favorite) {
    favorite = new DB.Favorite({ courseId: options.courseId, userId, type: 'course' });
    await favorite.save();
  }

  return favorite;
};

exports.unFavorite = async (userId, courseId) => {
  const favorite = await DB.Favorite.findOne({ courseId, userId });
  if (!favorite) {
    throw new Error('Favorite not found');
  }
  await favorite.remove();
  return { success: true };
};

exports.isFavorite = async (items, userId) => {
  return items.length
    ? await Promise.all(
        items.map(async item => {
          if (item.course) {
            item.course.tutor = item.course.tutor.getPublicProfile();
            item = item.toObject();
            item.course.isFavorite = true;
            const booked = await DB.Transaction.count({
              targetId: item.course._id,
              type: 'booking',
              paid: true,
              $or: [{ userId: userId }, { idRecipient: userId }]
            });
            item.course.booked = booked > 0 ? true : false;
            return item.course;
          }
        })
      )
    : [];
};
