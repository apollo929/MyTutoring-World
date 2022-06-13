module.exports = async () => {
  try {
    const user = await Service.ZoomUs.createUser({
      email: 'gk@instarama.net',
      first_name: 'S',
      last_name: 'GK',
      action: 'autoCreate'
    });
    console.log('user>>>>>>>>>>>>>>', user);
  } catch (e) {
    console.log(e);
  }
};
