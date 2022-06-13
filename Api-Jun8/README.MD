## Overview

API for Ceerno - Souleymane project

## Requirement

- [NodeJS](https://nodejs.org/en/download/) >= v8.x, npm >= 5.x
- [MongoDB](https://www.mongodb.com/download-center#atlas) >= 3.6
- [GraphicsMagick](http://www.graphicsmagick.org/)
- [FFMPEG](https://www.ffmpeg.org/) if use to upload, convert video file service

## Installation

- Install all softwares above
- CD to app root
- Run `npm run dev` to start `web app` in development environment
- Create `.env` file in the root folder by copy `env.example` content file and update config to your env
- Create `[env].json` file in the `config` folder. Copy content from `development.json` and update config to your env

## API

- Install api doc by `npm install apidoc -g`
- CD to folder and run `apidoc -i server/module -o apidocs`

## Testing

- Create `.env` file in the test folder by copy `env.example` content file and update config to your env
- Create `test.json` file in the `config` folder. Copy content from `development.json` and update config to your env
- Run `npm test`

## Note

- For file upload in the server, should create a cron job to remove media file in the tmp folder if it is too old. cause tmp folder is just reset if server is rebooted
- Example the job run every hour and remove media file older than 4h

```
0 * * * * /tmp/*.mp4 -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.MP4 -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.mov -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.MOV -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.mkv -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.MKV -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.jpg -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.JPG -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.jpeg -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.JPEG -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.png -type d -mmin +240 -print0 | xargs -0 rm -rf
0 * * * * find /tmp/*.PNG -type d -mmin +240 -print0 | xargs -0 rm -rf
```

## Update data for v3.0.4

- `nano script.js` => add `await require('./scripts/update-data-webinar')();` like example in file
- run `server/script.js`
