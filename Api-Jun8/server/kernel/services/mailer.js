const path = require('path');
const nconf = require('nconf');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sparkPostTransport = require('nodemailer-sparkpost-transport');
const pepipostTransport = require('nodemailer-pepipost-transport');
const Queue = require('./queue');

const swig = require('./template-engine').getSwigEngine();

const mailFrom = nconf.get('mailFrom');
const viewsPath = path.join(__dirname, '..', '..', 'emails');
const sendgridApiKey = nconf.get('SENDGRID_API_KEY');
const emailQ = Queue.create('email');

function Mailer(options) {
  this.transport = nodemailer.createTransport(options);
}

Mailer.prototype.render = function render(template, options) {
  return swig.renderFile(path.join(viewsPath, template), options || {});
};

Mailer.prototype.renderFromString = function renderFromString(str, options) {
  return swig.render(str, {
    locals: options || {}
  });
};

Mailer.prototype.send = async function send(opts) {
  try {
    const options = opts || {};
    // TODO - pass default value
    // _.defaults(options, {
    //   from : config.emailFrom,
    //   bcc : config.bccEmails || []
    // });

    return this.transport.sendMail(options);
  } catch (e) {
    // TODO - log here
    return console.log('Send mail error', e);
  }
};

Mailer.prototype.sendMail = async function sendMail(template, emails, options) {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['facebookLink', 'twitterLink', 'instagramLink', 'siteLogo', 'siteName', 'currencySymbol']
      }
    }).exec();
    const data = {};
    configs.forEach(item => {
      data[item.key] = item.value;
    });
    const newOptions = Object.assign(options, {
      appConfig: {
        baseUrl: nconf.get('baseUrl'),
        userWebUrl: nconf.get('userWebUrl'),
        adminWebUrl: nconf.get('adminWebUrl'),
        logoUrl: data.siteLogo || nconf.get('logoUrl'),
        siteName: data.siteName || nconf.get('SITE_NAME'),
        facebookUrl: data.facebookLink || nconf.get('facebookUrl'),
        twitterUrl: data.twitterLink || nconf.get('twitterUrl'),
        instagramUrl: data.instagramLink || nconf.get('instagramUrl') || '',
        currencySymbol: data.currencySymbol || '$'
      }
    });
    const output =
      options.renderFromString && options.renderTemplateContent
        ? this.renderFromString(options.renderTemplateContent, newOptions)
        : this.render(template, newOptions);
    const resp = await this.send({
      to: emails,
      from: options.from || mailFrom,
      subject: options.subject,
      html: output
    });

    return resp;
  } catch (e) {
    throw e;
  }
};

Mailer.prototype.close = () => this.transport.close();
let mailer;
async function init() {
  const mailService = nconf.get('MAIL_SERVICE');
  const smtpValue = await DB.Config.findOne({ key: 'smtpTransporter' });

  if (mailService === 'sparkpost') {
    mailer = new Mailer(
      sparkPostTransport({
        sparkPostApiKey: nconf.get('SPARKPOST_API_KEY')
      })
    );
  } else if (mailService === 'sendgrid') {
    mailer = new Mailer(
      sgTransport({
        auth: {
          api_key: sendgridApiKey
        }
      })
    );
  } else {
    const smtp =
      smtpValue.value.type === 'service'
        ? {
            service: smtpValue.value.service.name,
            auth: {
              user: smtpValue.value.service.auth.user,
              pass: smtpValue.value.service.auth.pass
            }
          }
        : {
            host: smtpValue.value.custom.host,
            port: smtpValue.value.custom.port,
            secure: smtpValue.value.custom.secure,
            auth: {
              user: smtpValue.value.custom.auth.user,
              pass: smtpValue.value.custom.auth.pass
            }
            // tls: {
            //   rejectUnauthorized: true
            // }
          };
    mailer = new Mailer(smtp);
  }
}

emailQ.process(async (job, done) => {
  try {
    await init();
    await mailer.sendMail(job.data.template, job.data.emails, job.data.options);
  } catch (e) {
    // TODO - log error here
    console.log('Send email error', e);
  }

  done();
});

module.exports = {
  send(template, emails, options) {
    emailQ.createJob({ template, emails, options }).save();
  }
};
