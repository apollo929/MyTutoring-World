const Ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * convert to mp4 which can play in the browser
 */
exports.toMp3 = async options => {
  const filePath = options.filePath;
  const fileName = `${Helper.String.randomString(5)}_${Helper.String.getFileName(filePath, true)}.mp3`;
  const savePath = path.join(Helper.String.getFilePath(filePath), fileName);

  return new Promise((resolve, reject) => {
    const command = new Ffmpeg(filePath)
      // set target codec
      .audioCodec('libmp3lame')
      // .addOption('-vf', 'scale=2*trunc(iw/2):-2')
      // .outputOptions('-strict -2')
      .outputOptions(['-vtag DIVX'])
      .audioBitrate('128k')
      .on('end', () => resolve(fileName))
      .on('error', reject)
      .toFormat('mp3');

    if (options.size) {
      command.size(options.size);
    }
    // save to file
    command.save(savePath);
  });
};

exports.getDuration = async filePath =>
  new Promise((resolve, reject) => {
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
exports.canPlayInBrowser = async filePath =>
  new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }

      if (!metadata.streams || !metadata.streams.length) {
        return reject('Cannot get info');
      }
      const streamInfo = metadata.streams[0];
      return resolve(streamInfo.codec_name === 'mp3');
    });
  });
