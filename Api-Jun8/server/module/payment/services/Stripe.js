const Stripe = require('stripe');
const zeroDecimalCurrencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
exports.charge = async (transaction, token) => {
  try {
    const configs = await DB.Config.find({
      key: {
        $in: ['currency', 'stripeKey', 'commissionRate', 'commissionCourse']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const currency = dataConfig.currency ? dataConfig.currency : 'usd';
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const data = await _stripe.charges.create({
      amount: parseInt(transaction.price * 100, 10),
      currency: currency.toLowerCase(),
      source: token, // obtained with Stripe.js
      metadata: {
        webinarId: (transaction.webinarId && transaction.webinarId.toString()) || '',
        subjectId: (transaction.subjectId && transaction.subjectId.toString()) || '',
        type: transaction.type
      }
    });
    if (data.status !== 'succeeded' || !data.paid) {
      throw data;
    }

    return data;
  } catch (e) {
    throw e;
  }
};

exports.createPaymentIntent = async transaction => {
  try {
    const tutor = transaction.tutorId instanceof DB.User ? transaction.tutorId : await DB.User.findOne({ _id: transaction.tutorId });
    if (!tutor) {
      return false;
    }
    let data = null;
    if (tutor.accountStripeId) {
      const configs = await DB.Config.find({
        key: {
          $in: ['currency', 'stripeKey', 'commissionRate', 'commissionCourse']
        }
      }).exec();
      const dataConfig = {};
      configs.forEach(item => {
        dataConfig[item.key] = item.value;
      });
      let commissionRate = process.env.COMMISSION_RATE;
      if (dataConfig.commissionRate) {
        commissionRate = dataConfig.commissionRate;
        if (commissionRate > 1) {
          if (commissionRate > 100) {
            commissionRate = 100;
          }
          commissionRate = commissionRate / 100;
        }
      }
      let price = transaction.price;
      if (transaction.targetType === 'subject') {
        price = transaction.originalPrice;
      }

      let commission = price * (tutor.commissionRate ? tutor.commissionRate : commissionRate);
      const balance = price - commission;
      if (transaction.usedCoupon && transaction.couponCode) {
        commission = transaction.price - balance;
      }
      const currency = dataConfig.currency ? dataConfig.currency || '' : 'usd';
      const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
      const _stripe = new Stripe(stripeKey);
      const isZeroDecimalCurrency = zeroDecimalCurrencies.indexOf(currency.toUpperCase()) > -1 ? true : false;
      const amount = isZeroDecimalCurrency
        ? parseInt(transaction.priceForPayment + transaction.applicationFee, 10)
        : parseInt((transaction.priceForPayment + transaction.applicationFee) * 100, 10);
      const fee = isZeroDecimalCurrency ? parseInt(commission, 10) : parseInt(commission * 100, 10);
      data = await _stripe.paymentIntents.create({
        description: transaction.description,
        amount: amount,
        currency: currency.toLowerCase(),
        metadata: {
          transactionId: transaction._id.toString()
        },
        application_fee_amount: fee,
        transfer_data: {
          destination: tutor.accountStripeId
        },
        on_behalf_of: tutor.accountStripeId
      });
    }

    return data;
  } catch (e) {
    throw e;
  }
};

exports.createAccount = async options => {
  try {
    const configs = await DB.Config.find({
      key: {
        $in: ['stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const data = await _stripe.accounts.create(Object.assign(options));
    return data;
  } catch (e) {
    throw e;
  }
};

exports.getDetailAccount = async accountId => {
  try {
    const configs = await DB.Config.find({
      key: {
        $in: ['stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const data = await _stripe.accounts.retrieve(accountId);
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.deleteAccount = async options => {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const deleted = await _stripe.accounts.del(options.accountId);
    return deleted;
  } catch (e) {
    throw e;
  }
};

exports.updateAccount = async (accountId, options) => {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const updated = await _stripe.accounts.update(accountId, options);
    return updated;
  } catch (e) {
    throw e;
  }
};

exports.createAccountLink = async options => {
  try {
    const configs = await DB.Config.find({
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const accountLink = await _stripe.accountLinks.create({
      account: options.accountId,
      refresh_url: options.refresh_url,
      return_url: options.return_url,
      type: 'account_onboarding'
    });
    return accountLink;
  } catch (e) {
    throw e;
  }
};

exports.createBankTok = async options => {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const bankAccountTok = await _stripe.tokens.create(options);
    return bankAccountTok;
  } catch (e) {
    throw e;
  }
};

exports.createBankAccount = async (accountId, options) => {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const bankAccount = await _stripe.accounts.createExternalAccount(accountId, {
      external_account: options.bankTok
    });
    return bankAccount;
  } catch (e) {
    throw e;
  }
};

exports.createCardAccount = async options => {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const cardAccount = await _stripe.accounts.createExternalAccount(options.accountId, {
      external_account: options.cardTok
    });
    return cardAccount;
  } catch (e) {
    throw e;
  }
};

exports.acceptance = async (accountId, options) => {
  try {
    const configs = await DB.Config.find({
      public: true,
      key: {
        $in: ['currency', 'stripeKey']
      }
    }).exec();
    const dataConfig = {};
    configs.forEach(item => {
      dataConfig[item.key] = item.value;
    });
    const stripeKey = dataConfig.stripeKey ? dataConfig.stripeKey : process.env.STRIPE_SECRET_KEY;
    const _stripe = new Stripe(stripeKey);
    const cardAccount = await _stripe.accounts.update(accountId, {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: options.remoteAddress,
        service_agreement: 'full'
      }
    });
    return cardAccount;
  } catch (e) {
    throw e;
  }
};
