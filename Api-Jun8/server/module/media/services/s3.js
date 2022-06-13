const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const url = require('url');

AWS.config.region = process.env.AWS_S3_REGION;
AWS.config.accessKeyId = process.env.AWS_S3_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.AWS_S3_SECRET_KEY;

exports.getUrl = (key) => {
  if (process.env.AWS_S3_BASE_URL) {
    return url.resolve(process.env.AWS_S3_BASE_URL, key);
  }

  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
};

exports.uploadBase64Image = async (base64Data, key) => {
  try {
    const s3Bucket = new AWS.S3({
      params: {
        Bucket: process.env.AWS_S3_BUCKET
      }
    });
    const buf = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const data = {
      Key: key,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    };
    return new Promise((resolve, reject) => s3Bucket.putObject(data, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(this.getUrl(key));
    }));
  } catch (e) {
    throw e;
  }
};

exports.getSignedUrl = (fileName, options = {}) => {
  // if fileName is url, we will extract key from url
  let key = fileName;
  if (Helper.String.isUrl(fileName)) {
    const parseData = url.parse(fileName);
    key = parseData.path;
    if (key[0] === '/') {
      key = key.substr(1);
    }
  }

  const s3Bucket = new AWS.S3({
    params: {
      Bucket: process.env.AWS_S3_BUCKET
    }
  });
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
  return s3Bucket.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: (options.expiresInMinutes || 60) * 60
  });
};

/**
* upload file to S3
* @param  {String}   filePath path to local file
* @param  {object}   options  null or object, optional
* allow params
* {
*   S3Params: {} //params object in S3, see more http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
*   folder: string to folder, this options will create a new folder in aws, after that add to filenam
* }
* @param  {Function} cb       Callback function
* @return {void}
*/
exports.uploadFile = async (filePathTemp, options = {}) => {
  try {
    let filePath;
    if (fs.existsSync(filePathTemp)) {
      filePath = filePathTemp;
    } else if (fs.existsSync(path.resolve(filePathTemp))) {
      filePath = path.resolve(filePathTemp);
    } else {
      throw new Error('File path does not exist!');
    }

    let fileName = path.parse(filePath).base;
    const ext = fileName.split('.').pop();

    // create slug from file name, remove ext
    // remove ext
    // 1) convert to lowercase
    // 2) remove dashes and pluses
    // 3) remove everything but alphanumeric characters and dashes
    // 4) replace spaces with dashes
    fileName = options.fileName || `${Math.random().toString(36).substring(7)}-${fileName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase().replace(/-+/g, '')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/\s+/g, '-')}.${ext}`;

    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fs.createReadStream(filePath),
      ContentType: Helper.String.getContentType(ext)
    };
    if (options.ACL) {
      params.ACL = options.ACL;
    }

    // check options to add folder to aws s3
    //  var folder = '';
    //  if (options.folder) {
    //    folder = options.folder.charAt(0) === '/' ? options.folder.replace('/', '') : options.folder;
    //    params.Bucket += (options.folder.charAt(0) === '/' ? '' : '/') + options.folder;
    //  }

    const s3 = new AWS.S3();
    return new Promise((resolve, reject) => s3.putObject(params, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        key: fileName,
        bucket: process.env.AWS_S3_BUCKET,
        url: this.getUrl(fileName)
      });
    }));
  } catch (e) {
    throw e;
  }
};

/**
 * delete S3 file
 * @param  {String/Array}   key filename
 * @param  {Function} cb
 * @return {Promise}
 */
exports.deleteFile = async (key) => {
  try {
    const keys = !Array.isArray(key) ? [key] : key;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Delete: {
        Objects: keys.map(k => ({ Key: k }))
      }
    };

    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3();
      s3.deleteObjects(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  } catch (e) {
    throw e;
  }
};
