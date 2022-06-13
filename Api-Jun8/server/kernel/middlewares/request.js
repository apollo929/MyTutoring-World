
exports.log = async (req, res, next) => {
  try {
    await Service.Logger.create({
      req,
      level: 'request-log'
    });
    next();
  } catch (e) {
    next(e);
  }
};
