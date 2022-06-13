describe('Test subject routes', () => {
  let subject;
  const newSubject = {
    name: 'Math',
    description: 'some text',
    price: 10
  };
  const postName = 'Math 2';

  before(async () => {
    newSubject.iconId = global.media.photo._id;
  });

  it('Should create new subject with admin role', async () => {
    const body = await testUtil.request('post', '/v1/subjects', adminToken, newSubject);

    expect(body).to.exist;
    expect(body.name).to.equal(newSubject.name);
    expect(body.alias).to.exist;
    subject = body;
  });

  it('Should update subject with admin role', async () => {
    const body = await testUtil.request('put', `/v1/subjects/${subject._id}`, adminToken, { name: postName });

    expect(body).to.exist;
    expect(body.name).to.equal(postName);
    subject = body;
  });

  it('Should get subject detail', async () => {
    const body = await testUtil.request('get', `/v1/subjects/${subject._id}`);

    expect(body).to.exist;
    expect(body.name).to.equal(postName);
    expect(body.icon).to.exist;
    expect(body.icon.fileUrl).to.exist;
  });

  it('Should search subjects', async () => {
    const body = await testUtil.request('get', '/v1/subjects');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
    expect(body.items).to.have.length(1);
    expect(body.items[0].icon.fileUrl).to.exist;
  });
});
