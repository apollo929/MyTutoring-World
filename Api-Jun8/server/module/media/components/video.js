const Ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * convert to mp4 which can play in the browser
 */
exports.toMp4 = async (options) => {
  const filePath = options.filePath;
  const fileName = `${Helper.String.randomString(5)}_${Helper.String.getFileName(filePath, true)}.mp4`;
  const savePath = path.join(Helper.String.getFilePath(filePath), fileName);

  return new Promise((resolve, reject) => {
    const command = new Ffmpeg(filePath)
      // set target codec
      .videoCodec('libx264')
      // .addOption('-vf', 'scale=2*trunc(iw/2):-2')
      .outputOptions('-strict -2')
      .on('end', () => resolve(fileName))
      .on('error', reject)
      .toFormat('mp4');

    if (options.size) {
      command.size(options.size);
    }
    // save to file
    command.save(savePath);
  });
};


exports.getScreenshot = async (options) => {
  const filePath = options.filePath;
  let thumbName = '';
  return new Promise((resolve, reject) => {
    new Ffmpeg(filePath)
      .on('filenames', (filenames) => {
        thumbName = filenames[0];
      })
      // TODO - define me
      .on('end', () => resolve(`/uploads/images/${thumbName}`))
      .on('error', reject)
      // take 2 screenshots at predefined timemarks and size
      .screenshot({
        // TODO - get from the configs
        folder: options.imageTempFolder,
        filename: `${Helper.String.randomString(5)}.png`,
        size: '640x480',
        timemarks: ['50%']
      });
  });
};

exports.getDuration = async filePath => new Promise((resolve, reject) => {
  Ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      return reject(err);
    }

    return resolve(parseInt(metadata.format.duration, 10));
  });
});

/**
 * check this video is mp4 with h264 in the profile
 * @param  {String} filePath path to file or in the public folder
 * @return {Promise}         Boolean type in promise
 */
exports.canPlayInBrowser = async filePath => new Promise((resolve, reject) => {
  Ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      return reject(err);
    }

    if (!metadata.streams || !metadata.streams.length) {
      return reject('Cannot get info');
    }
    const streamInfo = metadata.streams[0];
    return resolve(streamInfo.codec_name === 'webm' ||
      (streamInfo.codec_name === 'mp4' && streamInfo.codec_long_name.indexOf('H.264') > -1));
  });
});

/**
* create 20s clip from the video with format can post to Twitter
*/
exports.createClip = async options => new Promise((resolve, reject) => {
  const filePath = options.filePath;
  const fileName = `${Helper.String.randomString(5)}_clip_${Helper.String.getFileName(filePath, true)}.mp4`;
  const savePath = path.join(Helper.String.getFilePath(filePath), fileName);

  const command = new Ffmpeg(filePath)
    // set target codec
    // https://gist.github.com/nikhan/26ddd9c4e99bbf209dd7
    // ffmpeg -i in.mkv -pix_fmt yuv420p -vcodec libx264 -vf scale=640:-1 -acodec aac -vb 1024k -minrate 1024k -maxrate 1024k -bufsize 1024k -ar 44100  -ac 2  -strict experimental -r 30  out.mp4
    // ffmpeg -i test.mov -vcodec libx264 -vf 'scale=640:trunc(ow/a/2)*2' -acodec aac -vb 1024k -minrate 1024k -maxrate 1024k -bufsize 1024k -ar 44100 -strict experimental -r 30 out.mp4s
    .videoCodec('libx264')
    .addOption('-ss', options.fromTime || '0')
    .addOption('-t', '20')
    .addOption('-pix_fmt', 'yuv420p')
    .addOption('-vf', 'scale=640:-1')
    .addOption('-acodec', 'aac')
    .addOption('-vb', '1024k')
    .addOption('-minrate', '1024k')
    .addOption('-maxrate', '1024k')
    .addOption('-bufsize', '1024k')
    .addOption('-ar', '44100')
    .addOption('-ac', '2')
    .addOption('-r', '24')
    .size('360x?')
    .outputOptions('-strict experimental')
    .on('end', () => resolve(fileName))
    .on('error', reject)
    .toFormat('mp4');

  if (options.size) {
    command.size(options.size);
  }
  // save to file
  command.save(savePath);
});
