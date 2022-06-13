const meetingController = require('../controllers/meeting.controller');

module.exports = router => {
  router.post(
    '/v1/meeting/start/:appointmentId',
    Middleware.isAuthenticated,
    meetingController.startMeeting,
    Middleware.Response.success('signature')
  );

  router.post('/v1/meeting/join/:appointmentId', Middleware.isAuthenticated, meetingController.joinMeeting, Middleware.Response.success('signature'));

  router.get('/v1/permission/check', Middleware.isAuthenticated, meetingController.permissionCheck, Middleware.Response.success('permission'));
};
