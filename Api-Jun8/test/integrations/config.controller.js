const path = require('path');

describe('Test config', () => {
  let siteConfigId;

  it('Should get all configs with admin roles', async () => {
    const body = await testUtil.request('get', '/v1/system/configs', adminToken);

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
    
    body.items.forEach(item => {
      if (item.key === 'siteName') {
        siteConfigId = item._id;
      }
    });
  });
  
  it('Should update site name config with admin role', async () => {
    const body = await testUtil.request('put', `/v1/system/configs/${siteConfigId}`, adminToken, {
      value: 'New test site name'
    });

    expect(body).to.exist;
    expect(body.value).to.equal('New test site name');
  });

  it('Should get public config', async () => {
    const body = await testUtil.request('get', '/v1/system/configs/public');

    expect(body).to.exist;
    expect(body.siteName).to.exist;
  });
});
