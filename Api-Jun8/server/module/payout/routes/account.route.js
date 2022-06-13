const accountController = require('../controllers/account.controller');

module.exports = (router) => {
  /**
   * @apiDefine payoutRequest
   * @apiParam {String}   type  `paypal` or `bank-account`
   * @apiParam {String}   [paypalAccount] Required if type is `paypal`
   * @apiParam {String}   [accountHolderName] The recipient's full name
   * @apiParam {String}   [accountNumber] The recipient's bank account number
   * @apiParam {String}   [iban] The International Bank Account Number. Read More about IBANs https://www.xendpay.com/iban
   * @apiParam {String}   [bankName]
   * @apiParam {String}   [bankAddress]
   * @apiParam {String}   [sortCode] UK Bank code (6 digits usually displayed as 3 pairs of numbers)
   * @apiParam {String}   [routingNumber] The American Bankers Association Number (consists of 9 digits) and is also called a ABA Routing Number
   * @apiParam {String}   [swiftCode] A SWIFT Code consists of 8 or 11 characters, both numbers and letters e.g. RFXLGB2L. Read more about SWIFT/BIC codes https://www.xendpay.com/swiftbic-code
   * @apiParam {String}   [ifscCode] Indian Financial System Code, which is a unique 11-digit code that identifies the bank branch i.e. ICIC0001245. Read more about IFSC Code https://www.xendpay.com/ifsc-code.
   * @apiParam {String}   [routingCode] Any other local Bank Code - eg BSB number in Australia and New Zealand (6 digits)
   */

  /**
   * @apiGroup Payout account
   * @apiVersion 1.0.0
   * @apiName Create
   * @api {post} /v1/payout/accounts
   * @apiUse authRequest
   * @apiUse payoutRequest
   * @apiPermission tutor
   */
  router.post(
    '/v1/payout/accounts',
    Middleware.isAuthenticated,
    accountController.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup Payout account
   * @apiVersion 1.0.0
   * @apiName Update
   * @api {put} /v1/payout/accounts/:payoutAccountId
   * @apiUse authRequest
   * @apiParam {String}   payoutAccountId
   * @apiUse payoutRequest
   * @apiPermission tutor
   */
  router.put(
    '/v1/payout/accounts/:payoutAccountId',
    Middleware.isAuthenticated,
    accountController.findOne,
    accountController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Payout account
   * @apiVersion 1.0.0
   * @apiName Delete
   * @api {delete} /v1/payout/accounts/:payoutAccountId
   * @apiUse authRequest
   * @apiParam {String}   payoutAccountId
   * @apiPermission tutor
   */
  router.delete(
    '/v1/payout/accounts/:payoutAccountId',
    Middleware.isAuthenticated,
    accountController.findOne,
    accountController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Payout account
   * @apiVersion 1.0.0
   * @apiName Find one
   * @api {get} /v1/payout/accounts/:payoutAccountId
   * @apiUse authRequest
   * @apiParam {String}   payoutAccountId
   * @apiPermission tutor
   */
  router.get(
    '/v1/payout/accounts/:payoutAccountId',
    Middleware.isAuthenticated,
    accountController.findOne,
    Middleware.Response.success('payoutAccount')
  );

  /**
   * @apiGroup Payout account
   * @apiVersion 1.0.0
   * @apiName List
   * @api {get} /v1/payout/accounts?:type
   * @apiUse authRequest
   * @apiParam {String}   [type]
   * @apiUse paginationQuery
   * @apiPermission tutor
   */
  router.get(
    '/v1/payout/accounts',
    Middleware.isAuthenticated,
    accountController.list,
    Middleware.Response.success('list')
  );
};
