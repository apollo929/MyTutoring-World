describe('Test review', () => {
  let appointment;
  const newReview = {
    comment: 'some text',
    rating: 4,
    type: 'appointment'
  };
  let review;

  before(async () => {
    appointment = new DB.Appointment({
      status: 'completed',
      tutorId: global.admin._id,
      userId: global.user._id
    });
    await appointment.save();
    newReview.appointmentId = appointment._id;
  });

  after(async () => {
    await appointment.remove();
  });

  it('Tutor should review a user via appointment', async () => {
    const body = await testUtil.request('post', '/v1/reviews', global.adminToken, newReview);

    expect(body).to.exist;
    expect(body.rating).to.equal(4);
    review = body;
  });

  it('User avg of rating should be updated', async () => {
    const user = await DB.User.findOne({ _id: global.user._id });

    expect(user).to.exist;
    expect(user.ratingAvg).to.equal(4);
    expect(user.totalRating).to.equal(1);
    expect(user.ratingScore).to.equal(4);
  });

  it('User should review a tutor via appointment', async () => {
    const body = await testUtil.request('post', '/v1/reviews', global.userToken, newReview);

    expect(body).to.exist;
    expect(body.rating).to.equal(4);
    review = body;
  });

  it('Tutor avg of rating should be updated', async () => {
    const user = await DB.User.findOne({ _id: global.admin._id });

    expect(user).to.exist;
    expect(user.ratingAvg).to.equal(4);
    expect(user.totalRating).to.equal(1);
    expect(user.ratingScore).to.equal(4);
  });

  it('Appointment rating data should be updated', async () => {
    const appointmentCheck = await DB.Appointment.findOne({ _id: appointment._id });

    expect(appointmentCheck).to.exist;
    expect(appointmentCheck.tutorRating).to.equal(4);
    expect(appointmentCheck.userRating).to.equal(4);
  });

  it('Should update review', async () => {
    const body = await testUtil.request('put', `/v1/reviews/${review._id}`, global.adminToken, {
      rating: 5
    });

    expect(body).to.exist;
    expect(body.rating).to.equal(5);
  });

  // TODO - check updated data

  it('Should get review detail', async () => {
    const body = await testUtil.request('get', `/v1/reviews/${review._id}`);

    expect(body).to.exist;
    expect(body.rating).to.equal(5);
  });

  it('Should get list of reviews', async () => {
    const body = await testUtil.request('get', '/v1/reviews');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
    expect(body.items).to.have.length(2);
  });

  it('Should get current review of an item', async () => {
    const body = await testUtil.request('get', `/v1/reviews/appointment/${appointment._id}/current`, global.adminToken);

    expect(body).to.exist;
    expect(body.rating).to.exist;
  });
});
