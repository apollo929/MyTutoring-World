describe('Test appointment module', () => {
  let appointment;

  before(async () => {
    appointment = new DB.Appointment({
      userId: global.user._id,
      tutorId: global.admin._id,
      startTime: new Date(),
      toTime: new Date()
    });

    await appointment.save();
  });

  it('Should get list by admin role', async () => {
    const body = await testUtil.request('get', '/v1/appointments', global.adminToken);

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
    expect(body.items[0].tutor).to.exist;
    expect(body.items[0].tutor.name).to.exist;
    expect(body.items[0].user).to.exist;
    expect(body.items[0].user.name).to.exist;
    expect(body.items[0].user.password).to.not.exist;
  });

  it('Should cancel an appointment by admin role', async () => {
    const body = await testUtil.request('post', `/v1/appointments/${appointment._id}/cancel`, global.adminToken, {
      reason: 'text'
    });
    expect(body).to.exist;
    expect(body.cancelReason).to.equal('text');
    expect(body.status).to.equal('cancelled');
  });

  it('Should get appointment detail', async () => {
    const body = await testUtil.request('get', `/v1/appointments/${appointment._id}`, global.adminToken);
    expect(body).to.exist;
    expect(body.status).to.equal('cancelled');
  });

  describe('Test services', () => {
    let appointment2;
    before(async () => {
      appointment2 = new DB.Appointment({
        userId: global.user._id,
        tutorId: global.admin._id,
        startTime: new Date(),
        toTime: new Date()
      });

      await appointment2.save();
    });
    it('Should update completed', async () => {
      await Service.Appointment.complete(appointment2._id);

      const test = await DB.Appointment.findOne({ _id: appointment2._id });
      expect(test.status).to.equal('completed');
    });
  });
});
