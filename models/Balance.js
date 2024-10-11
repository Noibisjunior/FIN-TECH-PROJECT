const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true`
  },
  currency: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});



module.exports = mongoose.model('Balance', balanceSchema);
