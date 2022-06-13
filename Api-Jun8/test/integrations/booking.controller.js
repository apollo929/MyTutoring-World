const moment = require('moment');

describe('Test booking module', () => {
  let availableTime;
  let subject;

  before(async () => {
    availableTime = new DB.AvailableTime({
      startTime: moment().add(1, 'day').startOf('day').add(6, 'hours'),
      toTime: moment().add(1, 'day').startOf('day').add(10, 'hours'),
      userId: global.admin._id
    });

    await availableTime.save();

    subject = new DB.Subject({
      name: 'Subject test',
      price: 20000
    });
    await subject.save();
  });

  it('Should not add booking in the past', async () => {
    const body = await testUtil.request('post', '/v1/appointments/book', global.userToken, {
      startTime: moment().add(-1, 'day').startOf('day'),
      toTime: moment().startOf('day').add(7, 'hours'),
      subjectId: subject._id,
      tutorId: global.admin._id
    }, 400);

    expect(body).to.not.exist;
  });

  it('Should not add booking if time is invalid', async () => {
    const body = await testUtil.request('post', '/v1/appointments/book', global.userToken, {
      startTime: moment().startOf('day').add(7, 'hours'),
      toTime: moment().startOf('day').add(6, 'hours'),
      subjectId: subject._id,
      tutorId: global.admin._id
    }, 400);

    expect(body).to.not.exist;
  });

  it('Should get url redirect', async () => {
    const body = await testUtil.request('post', '/v1/appointments/book', global.userToken, {
      startTime: moment().add(1, 'day').startOf('day').add(6, 'hours'),
      toTime: moment().add(1, 'day').startOf('day').add(7, 'hours'),
      subjectId: subject._id,
      tutorId: global.admin._id
    });

    expect(body).to.exist;
    expect(body.redirectUrl).to.exist;
  });

  it('Should not add booking if time is overlap', async () => {
    const body = await testUtil.request('post', '/v1/appointments/book', global.userToken, {
      startTime: moment().add(1, 'day').startOf('day').add(6, 'hours'),
      toTime: moment().add(1, 'day').startOf('day').add(7, 'hours'),
      subjectId: subject._id,
      tutorId: global.admin._id
    }, 400);

    expect(body).to.not.exist;
  });

  it('Should add booking again', async () => {
    const body = await testUtil.request('post', '/v1/appointments/book', global.userToken, {
      startTime: moment().add(1, 'day').startOf('day').add(7, 'hours'),
      toTime: moment().add(1, 'day').startOf('day').add(8, 'hours'),
      subjectId: subject._id,
      tutorId: global.admin._id
    });

    expect(body).to.exist;
    expect(body.redirectUrl).to.exist;
  });
});
