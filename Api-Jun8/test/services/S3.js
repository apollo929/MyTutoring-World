const path = require('path');

const testFile = path.join(__dirname, '..', 'assets', 'image.png');

describe('Test S3 upload', () => {
  let file;
  it('Should upload file', async () => {
    const data = await Service.S3.uploadFile(testFile, {
      fileName: 'media/test-file.png',
      ACL: 'public-read'
    });
    expect(data).is.exist;
    expect(data.key).is.exist;
    expect(data.url).is.exist;

    file = data;
  });

  it('Should delete file', async () => {
    const data = await Service.S3.deleteFile(file.key);
    expect(data).is.exist;
  });
});
