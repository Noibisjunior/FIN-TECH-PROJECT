// models/Wallet.js

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: String},
  currency: { type: String },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallet', walletSchema);
