const moment = require('moment');

describe('Test calendar module', () => {
  describe('Test available time', () => {
    let availableTime;

    it('Should create available time record', async () => {
      const data = {
        startTime: moment().startOf('day').add(6, 'hours'),
        toTime: moment().startOf('day').add(7, 'hours')
      };
      const body = await testUtil.request('post', '/v1/availableTime', global.userToken, data);

      expect(body).to.exist;
      expect(body._id).to.exist;
      availableTime = body;
    });

    it('Should get list available time', async () => {
      const body = await testUtil.request('get', '/v1/availableTime', global.userToken);
      expect(body).to.exist;
      expect(body.items).to.have.length(1);
    });

    it('Should get list available time with date range', async () => {
      const startTime = moment().startOf('day').add(7, 'hours').toDate()
        .toUTCString();
      const toTime = moment().startOf('day').add(8, 'hours').toDate()
        .toUTCString();
      const body = await testUtil.request('get', `/v1/availableTime?startTime=${startTime}&toTime=${toTime}`, global.userToken);
      expect(body).to.exist;
      expect(body.items).to.have.length(0);
    });

    it('Should update available time', async () => {
      const body = await testUtil.request('put', `/v1/availableTime/${availableTime._id}`, global.userToken, {
        startTime: moment().startOf('day').add(6, 'hours'),
        toTime: moment().startOf('day').add(9, 'hours')
      });

      expect(body).to.exist;
      expect(body._id).to.exist;
      const toTime = moment(body.toTime).startOf('day').add(9, 'hours').isSame(moment().startOf('day').add(9, 'hours'));
      expect(toTime).to.equal(true);
    });

    it('Should delete available time', async () => {
      const body = await testUtil.request('delete', `/v1/availableTime/${availableTime._id}`, global.userToken);

      expect(body).to.exist;
      expect(body.success).to.equal(true);
    });
  });
});
