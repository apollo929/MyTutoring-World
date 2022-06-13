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
