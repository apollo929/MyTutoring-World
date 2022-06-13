const path = require('path');

const imagePath = path.join(__dirname, '..', 'assets', 'image.png');
const videoPath = path.join(__dirname, '..', 'assets', 'video.mp4');

describe('Test media', () => {
  let category;
  let photo;
  let video;
  const newCategory = {
    name: 'Category 1',
    ordering: 1
  };
  const categoryName = 'Category 2';
  it('Should create new category with admin role', async () => {
    const body = await testUtil.request('post', '/v1/media/categories', adminToken, newCategory);

    expect(body).to.exist;
    expect(body.name).to.equal(newCategory.name);
    expect(body.ordering).to.equal(newCategory.ordering);
    expect(body.alias).to.exist;
    category = body;
  });

  it('Should update category with admin role', async () => {
    const body = await testUtil.request('put', `/v1/media/categories/${category._id}`, adminToken, { name: categoryName });

    expect(body).to.exist;
    expect(body.name).to.equal(categoryName);
  });

  it('Should get category', async () => {
    const body = await testUtil.request('get', `/v1/media/categories/${category._id}`);

    expect(body).to.exist;
    expect(body.name).to.equal(categoryName);
  });

  it('Should get list category', async () => {
    const body = await testUtil.request('get', '/v1/media/categories');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
  });


  it('Should upload a photo', async () => {
    await request.post('/v1/media/photos')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', imagePath)
      .field('categoryIds', JSON.stringify([category._id]))
      .expect(200)
      .then((res) => {
        const body = res.body.data;
        expect(body).to.exist;
        expect(body.fileUrl).to.exist;
        expect(body.mediumUrl).to.exist;
        expect(body.thumbUrl).to.exist;
        photo = body;
      });
  });

  it('Should get details a photo', async () => {
    const body = await testUtil.request('get', `/v1/media/photos/${photo._id}`);
    expect(body).to.exist;
    expect(body.name).to.exist;
    expect(body.categoryIds).to.be.length(1);
  });

  it('Should upload a video', async () => {
    await request.post('/v1/media/videos')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', videoPath)
      .field('categoryIds', JSON.stringify([category._id]))
      .expect(200)
      .then((res) => {
        const body = res.body.data;
        expect(body).to.exist;
        expect(body.fileUrl).to.exist;
        video = body;
      });
  });

  it('Should get details a video', async () => {
    const body = await testUtil.request('get', `/v1/media/videos/${video._id}`);
    expect(body).to.exist;
    expect(body.name).to.exist;
    expect(body.categoryIds).to.be.length(1);
  });

  it('Should delete a video', async () => {
    const body = await testUtil.request('delete', `/v1/media/videos/${video._id}`, adminToken);
    expect(body).to.exist;
  });

  it('Should delete a photo', async () => {
    const body = await testUtil.request('delete', `/v1/media/photos/${photo._id}`, adminToken);
    expect(body).to.exist;
  });
});
