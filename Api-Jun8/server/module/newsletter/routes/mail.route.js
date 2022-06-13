const mailController = require('../controllers/mail.controller');

module.exports = router => {
  /**
   * @apiGroup Newsletter
   * @apiVersion 1.0.0
   * @api {post} /v1/newsletter/sendmail Send email
   * @apiDescription Send email to all subscribers
   * @apiUse authRequest
   * @apiParam {String} subject
   * @apiParam {String} content
   * @apiParam {String} [userType]
   * @apiPermission superadmin
   */
  router.post(
    '/v1/newsletter/sendmail',
    Middleware.hasRole('admin'),
    mailController.sendEmail,
    Middleware.Response.success('sendEmail')
  );

  /**
   * @apiGroup Newsletter
   * @apiVersion 1.0.0
   * @api {post} /v1/newsletter/invite-friend Invite friend
   * @apiUse authRequest
   * @apiParam {Email} email
   * @apiPermission all
   */
  router.post(
    '/v1/newsletter/invite-friend',
    Middleware.isAuthenticated,
    mailController.inviteFriends,
    Middleware.Response.success('inviteFriends')
  );
};
