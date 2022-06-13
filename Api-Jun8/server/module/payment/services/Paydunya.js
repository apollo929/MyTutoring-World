const url = require('url');
const paydunya = require('paydunya');

exports.getSetting = async () => {
  try {
    const config = await DB.Config.findOne({ key: 'paydunyaSetting' });
    if (config) {
      const setup = new paydunya.Setup({
        masterKey: config.value.masterKey,
        privateKey: config.value.privateKey,
        publicKey: config.value.publicKey,
        token: config.value.token,
        mode: config.value.mode // optional. use in sandbox mode.
      });
      const store = new paydunya.Store({
        name: config.value.storeName, // only name is required
        tagline: config.value.storeTagline,
        phoneNumber: config.value.storePhone,
        postalAddress: config.value.storePortal,
        logoURL: config.value.storeLogoUrl
      });

      return { setup, store };
    }

    const setup = new paydunya.Setup({
      masterKey: process.env.PAYDUNYA_MASTER_KEY,
      privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
      publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
      token: process.env.PAYDUNYA_TOKEN,
      mode: process.env.PAYDUNYA_MODE // optional. use in sandbox mode.
    });
    const store = new paydunya.Store({
      name: process.env.PAYDUNYA_STORE_NAME, // only name is required
      tagline: process.env.PAYDUNYA_STORE_TAGLINE,
      phoneNumber: process.env.PAYDUNYA_STORE_PHONE,
      postalAddress: process.env.PAYDUNYA_STORE_POSTAL_ADDRESS,
      logoURL: process.env.PAYDUNYA_STORE_POSTAL_ADDRESS
    });

    return { setup, store };
  } catch (e) {
    throw e;
  }
};

exports.doCheckout = async options => {
  try {
    const setting = await this.getSetting();
    const invoice = new paydunya.CheckoutInvoice(setting.setup, setting.store);
    invoice.addItem(options.name, options.quantity || 1, options.unitPrice, options.totalPrice); // name, quantity, unit price, total price
    invoice.description = options.description || options.name;
    invoice.totalAmount = options.totalPrice;
    invoice.callbackURL = url.resolve(
      process.env.baseUrl,
      `v1/payment/paydunya/callback?transactionId=${options.transactionId}`
    );
    // invoice.callbackURL = `http://webhook.site/facfd73c-6fab-4fda-935d-091cadf96b7b?transactionId=${options.transactionId}`;
    invoice.returnURL = options.redirectSuccessUrl;
    invoice.cancelURL = options.cancelUrl;
    await invoice.create();
    return invoice;
  } catch (e) {
    throw e;
  }
};

exports.checking = async token => {
  try {
    const setting = await this.getSetting();
    const invoice = new paydunya.CheckoutInvoice(setting.setup, setting.store);
    await invoice.confirm(token);
    return invoice;
  } catch (e) {
    throw e;
  }
};
