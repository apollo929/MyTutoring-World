describe('Test i18n module', () => {
  let language;
  let text;
  let translation;
  const newLanguage = {
    key: 'en',
    name: 'English',
    flag: 'http://flag.com',
    isDefault: true,
    isActive: true
  };
  const langName = 'Post name 2';

  describe('Test language', () => {
    it('Should create new language with admin role', async () => {
      const body = await testUtil.request('post', '/v1/i18n/languages', adminToken, newLanguage);

      expect(body).to.exist;
      expect(body.name).to.equal(newLanguage.name);
      expect(body.key).to.exist;
      expect(body.flag).to.exist;
      language = body;
    });

    it('Should update language with admin role', async () => {
      const body = await testUtil.request('put', `/v1/i18n/languages/${language._id}`, adminToken, { name: langName });

      expect(body).to.exist;
      expect(body.name).to.equal(langName);
      language = body;
    });

    it('Should list languages', async () => {
      const body = await testUtil.request('get', '/v1/i18n/languages');

      expect(body).to.exist;
      expect(body.count).to.exist;
      expect(body.items).to.exist;
      expect(body.items).to.have.length(1);
    });

    it('Should remove language with admin role', async () => {
      const body = await testUtil.request('delete', `/v1/i18n/languages/${language._id}`, adminToken);

      expect(body).to.exist;
    });
  });

  describe('Test text', () => {
    it('Should add text', async () => {
      const body = await testUtil.request('post', '/v1/i18n/text', adminToken, { text: 'hello' });

      expect(body).to.exist;
      expect(body.text).to.equal('hello');
      text = body;
    });

    it('Should update text with admin role', async () => {
      const body = await testUtil.request('put', `/v1/i18n/text/${text._id}`, adminToken, { text: 'hi' });

      expect(body).to.exist;
      expect(body.text).to.equal('hi');
      language = body;
    });

    it('Should list text with admin role', async () => {
      const body = await testUtil.request('get', '/v1/i18n/text', adminToken);

      expect(body).to.exist;
      expect(body.count).to.exist;
      expect(body.items).to.exist;
      expect(body.items).to.have.length(1);
    });

    describe('Test translation', () => {
      const newTranslation = {
        lang: 'en',
        translation: 'Hello'
      };

      before(() => {
        newTranslation.textId = text._id;
      });

      it('Should add translation', async () => {
        const body = await testUtil.request('post', '/v1/i18n/translations', adminToken, newTranslation);

        expect(body).to.exist;
        expect(body.text).to.equal('hi');
        expect(body.translation).to.equal('Hello');
        translation = body;
      });

      it('Should update translation with admin role', async () => {
        const body = await testUtil.request('put', `/v1/i18n/translations/${translation._id}`, adminToken, { translation: 'hello world' });

        expect(body).to.exist;
        expect(body.text).to.equal('hi');
        expect(body.translation).to.equal('hello world');
        translation = body;
      });

      it('Should list translations with admin role', async () => {
        const body = await testUtil.request('get', '/v1/i18n/translations', adminToken);

        expect(body).to.exist;
        expect(body.count).to.exist;
        expect(body.items).to.exist;
        expect(body.items).to.have.length(1);
      });

      it('Should get language json data', async () => {
        const body = await testUtil.pureRequest('get', '/v1/i18n/en.json');

        expect(body).to.exist;
        expect(body.hi).to.equal('hello world');
      });

      it('Should remove translation with admin role', async () => {
        const body = await testUtil.request('delete', `/v1/i18n/translations/${translation._id}`, adminToken);

        expect(body).to.exist;
      });
    });

    describe('Test after delete text', () => {
      it('Should remove text with admin role', async () => {
        const body = await testUtil.request('delete', `/v1/i18n/text/${text._id}`, adminToken);

        expect(body).to.exist;
      });
    });
  });
});
