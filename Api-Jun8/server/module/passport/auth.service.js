const jwt = require('jsonwebtoken');

/**
 * Returns a jwt token signed by the app secret
 */
exports.signToken = (id, role, expireTokenDuration = 60 * 60 * 24) => jwt.sign({ _id: id, role }, process.env.SESSION_SECRET, {
  expiresIn: expireTokenDuration
});

/**
 * Set token cookie directly for oAuth strategies
 */
exports.setTokenCookie = (req, res) => {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = jwt.sign({ _id: req.user._id, role: req.user.role }, process.env.SESSION_SECRET, {
    expiresIn: 60 * 60 * 24
  });
  res.cookie('token', token);
  return res.redirect('/');
};
