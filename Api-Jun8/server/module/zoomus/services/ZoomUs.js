const request = require('request');
const jwt = require('jsonwebtoken');

exports.generateToken = async (expiresIn = 60 * 60 * 24) => {
  let zoomApiKey = process.env.ZOOM_API_KEY;
  let zoomApiSecret = process.env.ZOOM_API_SECRET;
  const zoomApi = await DB.Config.findOne({ key: 'zoomApiKey' });
  if (zoomApi && zoomApi.value && zoomApi.value.apiKey && zoomApi.value.apiSecret) {
    zoomApiKey = zoomApi.value.apiKey;
    zoomApiSecret = zoomApi.value.apiSecret;
  }
  return jwt.sign(
    {
      iss: zoomApiKey
    },
    zoomApiSecret,
    {
      expiresIn
    }
  );
};

exports.createUser = async options => {
  try {
    const token = await this.generateToken();
    return new Promise((resolve, reject) =>
      request(
        {
          uri: 'https://api.zoom.us/v2/users',
          method: 'POST',
          // https://zoom.github.io/api/#create-a-user
          json: {
            action: options.action || 'create',
            user_info: {
              email: options.email,
              type: 1,
              first_name: options.firstName || '',
              last_name: options.lastName || ''
            }
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.getUser = async email => {
  try {
    const token = await this.generateToken();
    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/users/${email}`,
          method: 'GET',
          json: {},
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.createMeeting = async options => {
  try {
    const token = await this.generateToken();

    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/users/${options.email}/meetings`,
          method: 'POST',
          json: {
            type: 1,
            settings: {
              auto_recording: 'cloud', // non, local, cloud
              approve_type: 0,
              host_video: true,
              participant_video: true
            }
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.getPastDetailMeeting = async meetingUUID => {
  try {
    const token = await this.generateToken();

    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/past_meetings/${meetingUUID}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(body));
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.getDetailMeeting = async meetingId => {
  try {
    const token = await this.generateToken();

    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/meetings/${meetingId}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(body));
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.getRecordings = async meetingId => {
  try {
    const token = await this.generateToken();

    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(body));
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.changeUserStatus = async email => {
  // change status activate || deactivate
  try {
    const token = await this.generateToken();
    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/users/${email}/status`,
          method: 'PUT',
          json: {},
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      )
    );
  } catch (e) {
    throw e;
  }
};

exports.deleteUser = async options => {
  try {
    const token = await this.generateToken();
    return new Promise((resolve, reject) =>
      request(
        {
          uri: `https://api.zoom.us/v2/users/${options.email}`,
          method: 'DELETE',
          // https://zoom.github.io/api/#create-a-user
          json: {
            action: options.action || 'disassociate',
            transfer_email: false,
            transfer_meeting: false,
            transfer_webinar: false,
            transfer_recording: false
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        }
      )
    );
  } catch (e) {
    throw e;
  }
};
