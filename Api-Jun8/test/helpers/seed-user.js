module.exports = async () => DB.User.find({})
  .remove()
  .then(async () => {
    const user = new DB.User({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test',
      emailVerified: true
    });
    const admin = new DB.User({
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin',
      emailVerified: true
    });

    await admin.save();
    await user.save();
    return {
      admin,
      user
    };
  });
