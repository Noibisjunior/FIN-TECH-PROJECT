const mongoose = require('mongoose');

const CInvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  customer: {
    name: String,
    email: String,
    address: {
      country: String,
      state: String,
      city: String,
      street: String,
      postalCode: String,
    },
  },
  items: [
    {
      description: String,
      quantity: Number,
      amount: Number,
    },
  ],
  currency: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
});

module.exports = mongoose.model('CInvoice', CInvoiceSchema);
