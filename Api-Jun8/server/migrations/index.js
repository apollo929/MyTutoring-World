/* eslint import/no-dynamic-require: 0 */

const args = process.argv.slice(2);
const path = require('path');

if (args.length && args[0] === 'test') {
  console.log('Test');
  process.exit();
}
if (args.length && args[0]) {
  setTimeout(async () => {
    console.log('Migrate data');
    await require(path.join(__dirname, args[0]))();

    console.log('migrate data done...');
    process.exit();
  });
} else {
  setTimeout(async () => {
    console.log('Migrate config');
    await require('./config')();

    console.log('Migrate user');
    await require('./user')();

    console.log('Migrate i18n');
    await require('./i18n')();

    console.log('Migrate pages');
    await require('./pages')();

    console.log('Migrate grades');
    await require('./grade')();

    console.log('migrate data done...');
    process.exit();
  });
}
