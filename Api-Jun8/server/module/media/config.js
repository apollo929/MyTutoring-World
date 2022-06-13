const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const photoDir = 'public/photos/';
const videoDir = 'public/videos/';
const audioDir = 'public/audios/';
const fileDir = 'public/files/';
const avatarDir = 'public/avatar/';

const fullVideoPath = path.resolve(videoDir);
const fullAudioPath = path.resolve(audioDir);
const fullPhotoPath = path.resolve(photoDir);
const fullFilePath = path.resolve(fileDir);
const fullAvatarPath = path.resolve(avatarDir);

if (!fs.existsSync(fullPhotoPath)) {
  mkdirp.sync(fullPhotoPath);
}

if (!fs.existsSync(fullFilePath)) {
  mkdirp.sync(fullFilePath);
}

if (!fs.existsSync(fullVideoPath)) {
  mkdirp.sync(fullVideoPath);
}

if (!fs.existsSync(fullAudioPath)) {
  mkdirp.sync(fullAudioPath);
}

if (!fs.existsSync(fullAvatarPath)) {
  mkdirp.sync(fullAvatarPath);
}

module.exports = {
  photoDir,
  videoDir,
  fileDir,
  audioDir,
  avatarDir
};
