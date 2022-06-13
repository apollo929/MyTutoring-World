exports.favorite = async (userId, options) => {
  const webinar = await DB.Webinar.findOne({ _id: options.webinarId });
  if (!webinar) {
    throw new Error('Webinar not found');
  }
  const user = await DB.User.findOne({ _id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  let favorite = await DB.Favorite.findOne({ webinarId: options.webinarId, userId });
  if (!favorite) {
    favorite = new DB.Favorite({ webinarId: options.webinarId, userId, type: 'webinar' });
    await favorite.save();
  }

  return favorite;
};

exports.unFavorite = async (userId, webinarId) => {
  const favorite = await DB.Favorite.findOne({ webinarId, userId });
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
          if (item.webinar) {
            item.webinar.tutor = item.webinar.tutor.getPublicProfile();
            item = item.toObject();
            item.webinar.isFavorite = true;

            const booked = await DB.Transaction.count({
              targetId: item.webinar._id,
              type: 'booking',
              paid: true,
              $or: [{ userId: userId }, { idRecipient: userId }]
            });

            // Check if the appointment has expired, then the user can rebook.
            const pendingAppointment = await DB.Appointment.count({
              status: {
                $in: ['pending', 'booked', 'progressing']
              },
              paid: true,
              webinarId: item.webinar._id,
              $or: [{ userId: userId }, { idRecipient: userId }]
            });

            item.webinar.booked = booked && pendingAppointment ? true : false;
            return item.webinar;
          }
        })
      )
    : [];
};
