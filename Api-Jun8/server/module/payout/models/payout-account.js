const Schema = require('mongoose').Schema;

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId
  },
  type: {
    type: String,
    enum: ['paypal', 'bank-account'],
    default: 'paypal'
  },
  paypalAccount: {
    type: String,
    trim: true
  },
  // information for bank
  accountHolderName: {
    // The recipient's full name
    type: String
  },
  // The recipient's bank account number
  accountNumber: {
    type: String
  },
  // The International Bank Account Number. Read More about IBANs https://www.xendpay.com/iban
  iban: String,
  bankName: String,
  bankAddress: String,
  // UK Bank code (6 digits usually displayed as 3 pairs of numbers)
  sortCode: String,
  // The American Bankers Association Number (consists of 9 digits) and is also called a ABA Routing Number
  routingNumber: String,
  // A SWIFT Code consists of 8 or 11 characters, both numbers and letters e.g. RFXLGB2L. Read more about SWIFT/BIC codes https://www.xendpay.com/swiftbic-code
  swiftCode: String,
  // Indian Financial System Code, which is a unique 11-digit code that identifies the bank branch i.e. ICIC0001245. Read more about IFSC Code https://www.xendpay.com/ifsc-code.
  ifscCode: String,
  // Any other local Bank Code - eg BSB number in Australia and New Zealand (6 digits)
  routingCode: String,
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  minimize: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = schema;
