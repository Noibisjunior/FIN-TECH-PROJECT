// models/Account.js
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  currency: {
    type: String,
  },
  accountHolder: {
    type: String,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  routingNumber: {
    type: String,
  },
  accountType: {
    type: String,
  },
  address: {
    type: String,
  }
});

module.exports = mongoose.model('Account', AccountSchema);
