module.exports = async () =>
  DB.Config.create(
    {
      key: 'teachwithusStudents',
      value: '150',
      name: 'Teach with us page - Number of students world wide',
      description: '',
      public: true,
      ordering: 20
    },
    {
      key: 'teachwithusLanguages',
      value: '150',
      name: 'Teach with us page - Number of different languages',
      description: '',
      public: true,
      ordering: 20
    },
    {
      key: 'teachwithusCourses',
      value: '150',
      name: 'Teach with us page - Number of course enrollments',
      description: '',
      public: true,
      ordering: 20
    },
    {
      key: 'teachwithusCountries',
      value: '150',
      name: 'Teach with us page - Number of countries taught',
      description: '',
      public: true,
      ordering: 20
    },
    {
      key: 'teachwithusCustomers',
      value: '150',
      name: 'Teach with us page - Number of enterprise customers',
      description: '',
      public: true,
      ordering: 20
    }
  );
