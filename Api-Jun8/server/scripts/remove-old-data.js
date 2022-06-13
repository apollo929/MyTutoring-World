module.exports = async () => {
  try {
    const transactions = await DB.Transaction.find({});
    if (transactions && transactions.length) {
      await Promise.all(
        transactions.map(async t => {
          await t.remove();
        })
      );
    }
    const refunds = await DB.RefundRequest.find({});
    if (refunds && refunds.length) {
      await Promise.all(
        refunds.map(async t => {
          await t.remove();
        })
      );
    }
    const payouts = await DB.PayoutRequest.find({});
    if (payouts && payouts.length) {
      await Promise.all(
        payouts.map(async t => {
          await t.remove();
        })
      );
    }

    const appointments = await DB.Appointment.find({});
    if (appointments && appointments.length) {
      await Promise.all(
        appointments.map(async t => {
          await t.remove();
        })
      );
    }
  } catch (e) {
    console.log(e);
  }
};
