const path = require('path');
const nconf = require('nconf');

// cause we have to run queue with local file, so we will create queue name just for single server
// for scaling, so we will create a random key her as prefix/subfix for some queue
process.env.LOCAL_ID = Math.random().toString(36).substring(7);

nconf
  .argv()
  .env()
  .file({ file: path.resolve(path.join(__dirname, 'config', `${process.env.NODE_ENV}.json`)) });

const Kernel = require('./kernel');

const kernel = new Kernel();

kernel.loadModule(require('./module/system'));
kernel.loadModule(require('./module/user'));
kernel.loadModule(require('./module/passport'));
kernel.loadModule(require('./module/post'));
kernel.loadModule(require('./module/media'));
kernel.loadModule(require('./module/i18n'));
kernel.loadModule(require('./module/newsletter'));
kernel.loadModule(require('./module/banner'));
kernel.loadModule(require('./module/tutor'));
kernel.loadModule(require('./module/booking'));
kernel.loadModule(require('./module/payment'));
kernel.loadModule(require('./module/calendar'));
kernel.loadModule(require('./module/payout'));
kernel.loadModule(require('./module/refund'));
kernel.loadModule(require('./module/review'));
kernel.loadModule(require('./module/category'));
kernel.loadModule(require('./module/topic'));
kernel.loadModule(require('./module/coupon'));
kernel.loadModule(require('./module/testimonial'));
kernel.loadModule(require('./module/favorite'));
kernel.loadModule(require('./module/message'));
kernel.loadModule(require('./module/socket'));
kernel.loadModule(require('./module/stats'));
kernel.loadModule(require('./module/zoomus'));
kernel.loadModule(require('./module/meeting'));
kernel.loadModule(require('./module/webinar'));
kernel.loadModule(require('./module/course'));

// NOTE - compose at last
kernel.compose();

module.exports = kernel;
