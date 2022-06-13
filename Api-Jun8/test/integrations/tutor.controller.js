const path = require('path');

const imagePath = path.join(__dirname, '..', 'assets', 'image.png');

describe('Test tutor endpoints', () => {
  let subject;
  let tutor;
  const newTutor = {
    name: 'Math',
    bio: 'some text',
    email: 'someemail@test.com'
  };
  const tutorName = 'Math 2';

  before(async () => {
    subject = new DB.Subject({ name: 'Math' });
    await subject.save();

    newTutor.subjectIds = [subject._id];
  });

  after(async () => {
    subject.remove();
  });

  it('Should register successfully', async () => {
    await request.post('/v1/tutors/register')
      .attach('file', imagePath)
      .field('name', 'tutorname')
      .field('email', 'testingtutor@yopmail.com')
      .field('password', '123456')
      .field('country', 'Spain')
      .expect(200)
      .then(async (res) => {
        const body = res.body.data;
        expect(body).to.exist;

        const user = await DB.User.findOne({ email: 'testingtutor@yopmail.com' });
        expect(user.email).to.equal('testingtutor@yopmail.com');
        expect(user.issueDocument).to.exist;
      });
  });

  it('Should create new tutor with admin role', async () => {
    const body = await testUtil.request('post', '/v1/tutors', adminToken, newTutor);

    expect(body).to.exist;
    expect(body.name).to.equal(newTutor.name);
    expect(body.username).to.exist;
    tutor = body;
  });

  it('Should update tutor with admin role', async () => {
    const body = await testUtil.request('put', `/v1/tutors/${tutor._id}`, adminToken, {
      name: tutorName,
      grades: ['1', '2']
    });

    expect(body).to.exist;
    expect(body.name).to.equal(tutorName);
    expect(body.grades).to.have.length(2);
    tutor = body;
  });

  it('Should populate issue document detail', async () => {
    const user = await DB.User.findOne({ email: 'testingtutor@yopmail.com' });
    const body = await testUtil.request('get', `/v1/tutors/${user._id}`, global.adminToken);

    expect(body).to.exist;
    expect(body.issueDocument.fileUrl).to.exist;
  });

  it('Should get tutor detail', async () => {
    const body = await testUtil.request('get', `/v1/tutors/${tutor._id}`);

    expect(body).to.exist;
    expect(body.name).to.equal(tutorName);
    expect(body.username).to.exist;
    expect(body.subjects).to.exist;
    expect(body.grades).to.exist;
    expect(body.grades).to.have.length(2);
  });

  it('Should search tutors', async () => {
    const body = await testUtil.request('get', '/v1/tutors');

    expect(body).to.exist;
    expect(body.count).to.exist;
    expect(body.items).to.exist;
    expect(body.items).to.have.length(1);
    // expect(body.items[0].subjects).to.exist;
  });
});
