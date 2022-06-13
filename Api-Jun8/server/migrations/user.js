module.exports = async () =>
  DB.User.find({})
    .remove()
    .then(() =>
      DB.User.create(
        {
          provider: 'local',
          name: 'Test User',
          email: 'test@livelearn.info',
          password: 'livelearn.info',
          emailVerified: true
        },
        {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: process.env.ADMIN_EMAIL || 'admin@livelearn.info',
          password: process.env.APP_NAME || 'livelearn.info',
          isZoomAccount: true,
          emailVerified: true
        }
      )
    );
