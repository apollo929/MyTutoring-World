describe('Test contact module', () => {
  it('Should send contact', async () => {
    const body = await testUtil.request('post', '/v1/contact', null, {
      name: 'Some name',
      email: 'abc@email.com',
      message: 'Test message'
    });

    expect(body).to.exist;
    expect(body.success).to.equal(true);
  });
});
