exports.create = async (options) => {
  try {
    let comissionRate = process.env.COMMISSION_RATE;
    const config = await DB.Config.findOne({ key: 'commissionRate' });
    if (config) {
      comissionRate = config.value;
    }
    const userId = options.userId;
    const transactionId = options.transactionId;

    const transaction = transactionId instanceof DB.Transaction ?
      transactionId : await DB.Transaction.findOne({ _id: transactionId });
    if (!transaction) {
      throw new Error('Transaction not found!');
    }

    // const appointment = await DB.Appointment.findOne({ _id: transaction.appointmentId });
    const earn = transaction.price * comissionRate;
    const earning = new DB.Earning({
      userId,
      appointmentId: transaction.appointmentId,
      balance: transaction.price,
      earn,
      fee: transaction.price - earn,
      commission: comissionRate,
      isActive: options.isActive || false
    });
    await earning.save();
    return earning;
  } catch (e) {
    throw e;
  }
};
