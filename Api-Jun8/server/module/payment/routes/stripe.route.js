const stripeController = require('../controllers/stripe.controller');

module.exports = router => {
  router.post('/v1/payment/stripe/hook', Middleware.Request.log, stripeController.hook, Middleware.Response.success('hook'));

  // Route for stripe connect
  router.post('/v1/payment/stripe/create-account', Middleware.isAuthenticated, stripeController.createAccount, Middleware.Response.success('create'));
  router.delete(
    '/v1/payment/stripe/delete-account/:id',
    Middleware.Request.log,
    stripeController.deleteAccount,
    Middleware.Response.success('delete')
  );
  router.put('/v1/payment/stripe/update-account/:id', Middleware.Request.log, stripeController.updateAccount, Middleware.Response.success('update'));
  router.post(
    '/v1/payment/stripe/create-link',
    Middleware.isAuthenticated,
    stripeController.createAccountLink,
    Middleware.Response.success('createLink')
  );

  router.post(
    '/v1/payment/stripe/create-bank-tok',
    Middleware.Request.log,
    stripeController.createBankTok,
    Middleware.Response.success('createBankTok')
  );

  router.post(
    '/v1/payment/stripe/create-bank-account/:id',
    Middleware.Request.log,
    stripeController.createBankAccount,
    Middleware.Response.success('createBank')
  );
  router.post('/v1/payment/stripe/acceptance/:id', Middleware.Request.log, stripeController.acceptance, Middleware.Response.success('acceptance'));
  router.get('/v1/payment/stripe/retrieves/:id', Middleware.Request.log, stripeController.getDetailAccount, Middleware.Response.success('detail'));
  router.get('/v1/payment/stripe/status/:id', Middleware.isAuthenticated, stripeController.checkStatusAccount, Middleware.Response.success('status'));
  router.get(
    '/v1/payment/stripe/bank-account/:id',
    Middleware.isAuthenticated,
    stripeController.checkStatusAccount,
    Middleware.Response.success('bank')
  );
};
