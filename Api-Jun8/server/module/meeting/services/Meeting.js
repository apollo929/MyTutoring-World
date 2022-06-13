const crypto = require('crypto');
exports.generateSignature = async options => {
  try {
    let zoomApiKey = process.env.ZOOM_API_KEY;
    let zoomApiSecret = process.env.ZOOM_API_SECRET;
    const zoomApi = await DB.Config.findOne({ key: 'zoomApiKey' });
    if (zoomApi && zoomApi.value && zoomApi.value.apiKey && zoomApi.value.apiSecret) {
      zoomApiKey = zoomApi.value.apiKey;
      zoomApiSecret = zoomApi.value.apiSecret;
    }
    // Prevent time sync issue between client signature generation and zoom
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(zoomApiKey + options.meetingNumber + timestamp + options.role).toString('base64');
    const hash = crypto.createHmac('sha256', zoomApiSecret).update(msg).digest('base64');
    const signature = Buffer.from(`${zoomApiKey}.${options.meetingNumber}.${timestamp}.${options.role}.${hash}`).toString('base64');
    return signature;
  } catch (e) {
    throw e;
  }
};
