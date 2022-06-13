describe('Test transaction module', () => {
  let transaction;

  before(async () => {
    transaction = new DB.Transaction({
      userId: global.user._id,
      type: 'booking',
      paymentGateway: 'paypal'
    });

    await transaction.save();
  });

  it('Should get list by admin role', async () => {
    const body = await testUtil.request('get', '/v1/payment/transactions', global.adminToken);

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
    expect(body.items[0].user).to.exist;
    expect(body.items[0].user.name).to.exist;
    expect(body.items[0].user.password).to.not.exist;
  });

  it('Should get transaction detail', async () => {
    const body = await testUtil.request('get', `/v1/payment/transactions/${transaction._id}`, global.adminToken);

    expect(body).to.exist;
    expect(body.status).to.exist;
  });
});
