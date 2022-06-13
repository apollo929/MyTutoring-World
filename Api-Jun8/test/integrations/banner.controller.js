describe('Test banner module', () => {
  let banner;
  const newBanner = {
    title: 'Post 1',
    ordering: 1,
    position: 'home',
    meta: {
      key: 'value'
    }
  };
  const bannerName = 'Post name 2';

  before(() => {
    newBanner.mediaId = global.media.photo._id;
  });

  it('Should create new banner with admin role', async () => {
    const body = await testUtil.request('post', '/v1/banners', adminToken, newBanner);

    expect(body).to.exist;
    expect(body.title).to.equal(newBanner.title);
    expect(body.mediaId).to.exist;
    expect(body.meta).to.exist;
    banner = body;
  });

  it('Should update banner with admin role', async () => {
    const body = await testUtil.request('put', `/v1/banners/${banner._id}`, adminToken, { title: bannerName });

    expect(body).to.exist;
    expect(body.title).to.equal(bannerName);
    expect(body.mediaId).to.exist;
    expect(body.meta).to.exist;
  });

  it('Should get banner detail', async () => {
    const body = await testUtil.request('get', `/v1/banners/${banner._id}`);

    expect(body).to.exist;
    expect(body.title).to.equal(bannerName);
    expect(body.mediaId).to.exist;
    expect(body.media).to.exist;
    expect(body.meta).to.exist;
  });

  it('Should list banners', async () => {
    const body = await testUtil.request('get', '/v1/banners');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
  });

  it('Should random banners', async () => {
    const body = await testUtil.request('get', '/v1/banners/random');

    expect(body).to.exist;
    expect(Array.isArray(body)).to.equal(true);
    expect(body).to.be.length(1);
  });
});
