module.exports = async () =>
  DB.Config.find({ key: 'smtpTransporter' })
    .remove()
    .then(() =>
      DB.Config.create({
        key: 'smtpTransporter',
        value: {
          type: 'service', // custom
          service: {
            name: '',
            auth: {
              user: '',
              pass: ''
            }
          }, //
          custom: {
            host: '',
            port: 465,
            secure: true,
            auth: {
              user: '',
              pass: ''
            }
          }
        },
        name: 'SMTP Transport',
        description: 'Set up SMTP here',
        public: false,
        type: 'mixed',
        ordering: 14
      })
    );
