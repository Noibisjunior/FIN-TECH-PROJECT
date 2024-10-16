const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
     },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    enumeration: ['due', 'overdue', 'pending'],
  },
  dueDate: {
    type: Date,
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
