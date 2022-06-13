describe('Test post', () => {
  let category;
  let post;
  const newCategory = {
    name: 'Category 1',
    ordering: 1
  };
  const categoryName = 'Category 2';
  const newPost = {
    title: 'Post 1',
    ordering: 1,
    type: 'post'
  };
  const postName = 'Post name 2';

  it('Should create new category with admin role', async () => {
    const body = await testUtil.request('post', '/v1/posts/categories', adminToken, newCategory);

    expect(body).to.exist;
    expect(body.name).to.equal(newCategory.name);
    expect(body.ordering).to.equal(newCategory.ordering);
    expect(body.alias).to.exist;
    category = body;
    newPost.categoryIds = [category._id];
  });

  it('Should update category with admin role', async () => {
    const body = await testUtil.request('put', `/v1/posts/categories/${category._id}`, adminToken, { name: categoryName });

    expect(body).to.exist;
    expect(body.name).to.equal(categoryName);
  });

  it('Should get category', async () => {
    const body = await testUtil.request('get', `/v1/posts/categories/${category._id}`);

    expect(body).to.exist;
    expect(body.name).to.equal(categoryName);
  });

  it('Should get list category', async () => {
    const body = await testUtil.request('get', '/v1/posts/categories');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
  });

  it('Should create new post with admin role', async () => {
    const body = await testUtil.request('post', '/v1/posts', adminToken, newPost);

    expect(body).to.exist;
    expect(body.title).to.equal(newPost.title);
    expect(body.alias).to.exist;
    expect(body.categoryIds).to.be.length(1);
    post = body;
  });

  it('Should update post with admin role', async () => {
    const body = await testUtil.request('put', `/v1/posts/${post._id}`, adminToken, { title: postName, categoryIds: [] });

    expect(body).to.exist;
    expect(body.title).to.equal(postName);
    expect(body.categoryIds).to.be.length(0);
  });

  it('Should get post detail', async () => {
    const body = await testUtil.request('get', `/v1/posts/${post._id}`);

    expect(body).to.exist;
    expect(body.title).to.equal(postName);
  });

  it('Should search posts', async () => {
    const body = await testUtil.request('get', '/v1/posts');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
  });
});
