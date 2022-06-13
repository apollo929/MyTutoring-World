describe('Test payout module', () => {
  let payoutAccount;
  let payoutRequest;

  before(async () => {
  });

  describe('Test payout account module', () => {
    it('Should create new payout account', async () => {
      const body = await testUtil.request('post', '/v1/payout/accounts', global.userToken, {
        type: 'paypal',
        paypalAccount: 'test@account.com'
      });

      expect(body).to.exist;
      expect(body.type).to.equal('paypal');
      payoutAccount = body;
    });

    it('Should update paypal account', async () => {
      const body = await testUtil.request('put', `/v1/payout/accounts/${payoutAccount._id}`, global.userToken, {
        type: 'bank-account',
        bankName: 'some bank',
        swiftCode: '123'
      });

      expect(body).to.exist;
      expect(body.type).to.equal('bank-account');
      payoutAccount = body;
    });

    it('Should get list accounts', async () => {
      const body = await testUtil.request('get', '/v1/payout/accounts', global.userToken);

      expect(body).to.exist;
      expect(body.count).to.exist;
      expect(body.items).to.exist;
      expect(body.items).to.have.length(1);
    });

    it('Should delete account', async () => {
      const body = await testUtil.request('delete', `/v1/payout/accounts/${payoutAccount._id}`, global.userToken);

      expect(body).to.exist;
      expect(body.success).to.equal(true);
    });
  });

  describe('Test payout request module', () => {
    before(async () => {
      // create new account
      const body = await testUtil.request('post', '/v1/payout/accounts', global.userToken, {
        type: 'paypal',
        paypalAccount: 'test@account.com'
      });
      payoutAccount = body;

      await DB.Appointment.remove({ tutorId: global.user.tutorId });
    });

    describe('Test without appointment', () => {
      it('Should not send request if balance is not enough', async () => {
        const body = await testUtil.request('post', '/v1/payout/request', global.userToken, {
          payoutAccountId: payoutAccount._id
        }, 400);

        expect(body).to.not.exist;
      });
    });

    describe('Test with appointment', () => {
      before(async () => {
        await DB.Appointment.remove({ tutorId: global.user.tutorId });
        await DB.Appointment.create({
          status: 'completed',
          price: 100,
          commission: 20,
          balance: 80,
          tutorId: global.user._id
        }, {
          status: 'completed',
          price: 100,
          commission: 20,
          balance: 80,
          tutorId: global.user._id
        });
      });

      it('Should get balance', async () => {
        const body = await testUtil.request('get', '/v1/payout/balance', global.userToken);

        expect(body).to.exist;

        expect(body.commission).to.equal(40);
        expect(body.balance).to.equal(160);
        expect(body.total).to.equal(200);
      });

      it('Should get balance of tutor by admin ', async () => {
        const body = await testUtil.request('get', `/v1/payout/balance/${global.user._id}`, global.adminToken);

        expect(body).to.exist;

        expect(body.commission).to.equal(40);
        expect(body.balance).to.equal(160);
        expect(body.total).to.equal(200);
      });

      it('Should send request', async () => {
        const body = await testUtil.request('post', '/v1/payout/request', global.userToken, {
          payoutAccountId: payoutAccount._id
        });

        expect(body).to.exist;
        expect(body.code).to.exist;
        expect(body.payoutAccount).to.exist;
        expect(body.details).to.exist;
        expect(body.requestToTime).to.exist;
        expect(body.total).to.equal(200);
        expect(body.commission).to.equal(40);
        expect(body.balance).to.equal(160);

        payoutRequest = body;
      });

      it('Should update request if not approve yet', async () => {
        await DB.Appointment.create({
          status: 'completed',
          total: 100,
          commission: 20,
          balance: 80,
          tutorId: global.user._id
        });

        const body = await testUtil.request('post', '/v1/payout/request', global.userToken, {
          payoutAccountId: payoutAccount._id
        });

        expect(body).to.exist;
        expect(body.code).to.exist;
        expect(body.payoutAccount).to.exist;
        expect(body.details).to.exist;
        expect(body.requestToTime).to.exist;
        expect(body._id).to.equal(payoutRequest._id);
        payoutRequest = body;
      });

      it('Should reject request', async () => {
        const body = await testUtil.request('post', `/v1/payout/request/${payoutRequest._id}/reject`, global.adminToken, {
          rejectReason: 'some text',
          note: 'some text'
        });
        expect(body).to.exist;
      });

      it('Should approve request', async () => {
        const body = await testUtil.request('post', `/v1/payout/request/${payoutRequest._id}/approve`, global.adminToken, {
          note: 'some text'
        });
        expect(body).to.exist;
      });

      it('Should not send request after admin approved and order is mark completed', async () => {
        const body = await testUtil.request('post', '/v1/payout/request', global.userToken, {
          payoutAccountId: payoutAccount._id
        }, 400);

        expect(body).to.not.exist;
      });

      it('Should get list with tutor role', async () => {
        const body = await testUtil.request('get', '/v1/payout/requests', global.userToken);

        expect(body).to.exist;
        expect(body.items).to.exist;
        expect(body.count).to.exist;
        expect(body.items[0].tutor).to.exist;
      });

      it('Should get list with admin role', async () => {
        const body = await testUtil.request('get', '/v1/payout/requests', global.adminToken);

        expect(body).to.exist;
        expect(body.items).to.exist;
        expect(body.count).to.exist;
        expect(body.items[0].tutor).to.exist;
      });

      it('Should get details', async () => {
        const body = await testUtil.request('get', `/v1/payout/requests/${payoutRequest._id}`, global.adminToken);

        expect(body).to.exist;
        expect(body.code).to.exist;
        expect(body.tutor).to.exist;
      });
    });
  });
});
