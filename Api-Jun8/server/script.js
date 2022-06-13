const args = process.argv.slice(2);
const path = require('path');

require('dotenv').config();

require('./app');

if (args.length && args[0]) {
  setTimeout(async () => {
    await require(path.join(__dirname, 'scripts', args[0]))();

    console.log('Script done');
    process.exit();
  });
} else {
  setTimeout(async () => {
    console.log('Upgrade to newest version and apply previous change');
    await require('./scripts/update-tutor-pending-status')();
    process.exit();
  });
}
