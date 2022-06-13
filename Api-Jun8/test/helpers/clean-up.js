module.exports = async () => {
  await DB.Config.remove();
  await DB.User.remove();
  await DB.Post.remove();
  await DB.PostCategory.remove();
  await DB.Media.remove();
  await DB.MediaCategory.remove();
  await DB.Banner.remove();
  await DB.I18nLanguage.remove();
  await DB.I18nText.remove();
  await DB.I18nTranslation.remove();
  await DB.Contact.remove();
  await DB.Subject.remove();
  await DB.Appointment.remove();
  await DB.AvailableTime.remove();
  await DB.Review.remove();
};
