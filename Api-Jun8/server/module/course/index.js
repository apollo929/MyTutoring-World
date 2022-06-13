exports.model = {
  Course: require('./models/course'),
  CourseGoal: require('./models/goal'),
  LectureSection: require('./models/lecture_section'),
  Lecture: require('./models/lecture'),
  Progress: require('./models/progress'),
  MyCourse: require('./models/my-course')
};

exports.services = {
  Course: require('./services/Course')
};

exports.router = router => {
  require('./routes/course.route')(router);
  require('./routes/goal.route')(router);
  require('./routes/lecture_section')(router);
  require('./routes/lecture')(router);
  require('./routes/progress.route')(router);
};
