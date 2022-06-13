describe('Test newsletter module', () => {
  let contact;

  it('Should send newsletter to all users', async () => {
    const body = await testUtil.request('post', '/v1/newsletter/sendmail', global.adminToken, {
      subject: 'Testing newsletter',
      content: '<strong>Some text</strong>'
    });

    expect(body).to.exist;
    expect(body.success).to.equal(true);
  });

  it('Should register newsletter contact', async () => {
    const body = await testUtil.request('post', '/v1/newsletter/contact', null, {
      email: 'testing123@yopmail.com',
      name: 'Testing'
    });

    expect(body).to.exist;
    expect(body.success).to.equal(true);
  });

  it('Should list newsletter contact', async () => {
    const body = await testUtil.request('get', '/v1/newsletter/contact', global.adminToken);

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.have.length(1);
    contact = body.items[0];
  });

  it('Should delete newsletter contact', async () => {
    const body = await testUtil.request('delete', `/v1/newsletter/contact/${contact._id}`, global.adminToken);

    expect(body).to.exist;
    expect(body.success).to.equal(true);
  });
});
