/* eslint no-restricted-syntax: 0, no-await-in-loop: 0 */
module.exports = async () => {
  try {
    const appointment = await DB.Appointment.findOne();
    const users = await DB.User.find();
    for (const user of users) {
      const transaction = new DB.Transaction({
        userId: user._id,
        appointmentId: appointment ? appointment._id : null,
        paymentGateway: 'paypal',
        price: 100,
        status: 'completed'
      });
      await transaction.save();
    }
  } catch (e) {
    throw e;
  }
};
