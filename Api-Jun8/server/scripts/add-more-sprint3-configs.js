module.exports = async () =>
  DB.Config.create(
    {
      key: 'youtubeHowItWork',
      value:
        '<iframe width="100%" height="525" src="https://www.youtube.com/embed/ZU0gjnRU-Z4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      name: 'Iframe Youtube Video How It Work page (Change width: 100% and height: 525)',
      description:
        'Example: <iframe width="100%" height="525" src="https://www.youtube.com/embed/ZU0gjnRU-Z4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      public: true,
      ordering: 18
    },
    {
      key: 'maxFreeSlotToBook',
      value: 5,
      name: 'Maximum number of free trial classes one student can take',
      description: '',
      public: true,
      ordering: 19
    },
    {
      key: 'signupImage',
      value: '',
      name: 'Sign up image',
      description: 'Upload image show on sign up page',
      public: true,
      ordering: 3
    }
  );
