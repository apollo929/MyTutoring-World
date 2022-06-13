
exports.callback = async (req, res, next) => {
  try {
    if (!req.query.transactionId) {
      return next(PopulateResponse.notFound());
    }

    await Service.Payment.updatePayment(req.query.transactionId);
    res.callback = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};
