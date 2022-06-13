const request = require('request');
const fs = require('fs');
const flagDir = 'public/flags/';
const mkdirp = require('mkdirp');
const i18n = require('../module/i18n/index');

if (!fs.existsSync(flagDir)) {
  mkdirp.sync(flagDir);
}
module.exports = async () => {
  try {
    const countries = await DB.Country.find({});
    for (const c of countries) {
      c.flag = '';
      await c.save();
      // await download(`https://www.countries-ofthe-world.com/flags-normal/flag-of-South-Africa.png`, `${flagDir}/${c.code.toLowerCase()}.png`);
      c.flag = `flags/${c.code.toLowerCase()}.svg`;
      await c.save();
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// async function download(countryCode) {
//   return new Promise((resolve, reject) =>
//     request.head(`https://okfn.org/assets/img/flags/svg/flag-${countryCode.toLowerCase()}.svg`, function (err, res, body) {
//       console.log('content-type:', res.headers['content-type']);
//       console.log('content-length:', res.headers['content-length']);

//       request(`https://okfn.org/assets/img/flags/svg/flag-${countryCode.toLowerCase()}.svg`)
//         .pipe(fs.createWriteStream(`${flagDir}/${countryCode.toLowerCase()}.svg`))
//         .on('close', () => console.log('DONE'));
//     })
//   );
// }

async function download(url, dest) {
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url
      // gzip: true
    })
      .pipe(file)
      .on('finish', async () => {
        console.log(`The file is finished downloading.`);
        resolve();
      })
      .on('error', error => {
        reject(error);
      });
  }).catch(error => {
    console.log(`Something happened: ${error}`);
  });
}
