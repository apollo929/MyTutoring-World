describe('Test authentication', () => {
  let token;
  const registerParams = {
    email: 'testregisteremail@test.com',
    password: '12345678'
  };

  it('Should login as admin role', async () => {
    const body = await testUtil.request(
      'post',
      '/v1/auth/login',
      null,
      {
        email: 'admin@example.com',
        password: 'admin'
      }
    );

    expect(body).to.exist;
    expect(body.token).to.exist;
    token = body.token;
  });

  it('Should get profile with token', async () => {
    const body = await testUtil.request('get', '/v1/users/me', token);

    expect(body).to.exist;
    expect(body._id).to.exist;
    expect(body.email).to.equal('admin@example.com');
  });

  it('Should register successfully', async () => {
    const body = await testUtil.request('post', '/v1/auth/register', null, registerParams);

    expect(body).to.exist;
    expect(body.message).to.exist;
  });

  it('Should verify email', async () => {
    let user = await DB.User.findOne({ email: registerParams.email });
    expect(user).to.exist;
    expect(user.emailVerifiedToken).to.exist;

    const body = await testUtil.request('post', '/v1/auth/verifyEmail', null, {
      token: user.emailVerifiedToken
    });

    expect(body).to.exist;
    expect(body.message).to.exist;

    user = await DB.User.findOne({ email: registerParams.email });
    expect(user).to.exist;
    expect(user.emailVerifiedToken).not.exist;
    expect(user.emailVerified).to.equal(true);
  });

  it('Should login with registered user', async () => {
    const body = await testUtil.request(
      'post',
      '/v1/auth/login',
      null,
      registerParams
    );

    expect(body).to.exist;
    expect(body.token).to.exist;
    token = body.token;
  });
});
