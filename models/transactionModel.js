const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String},
  amount: { type: Number},
  accountType: { type: String},
  accountID: { type: String },
  currency: { type: String},
  receivingCurrency: { type: String },
  amountReceived: { type: Number },
  description: { type: String },
  agentPhoneNumber: { type: String },
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
