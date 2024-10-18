const mongoose = require('mongoose');
const crypto = require('crypto');


const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Debit', 'Credit'],
  },
  brand: {
    type: String,
    enum: ['Visa', 'Mastercard', 'American Express'],
  },
  // Encrypt card number for storage
  cardNumber: {
    type: String,
    set: encryptCardNumber,  // Function to encrypt before saving
    get: decryptCardNumber,  // Function to decrypt when retrieving
    select: false, // Exclude from default queries
  },
  // Store encrypted CVV
  cvv: {
    type: String,
    set: encryptCVV,
    get: decryptCVV,
    select: false,
  },
  expiryDate: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Function to encrypt the card number
function encryptCardNumber(cardNumber) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.CARD_ENCRYPTION_KEY);
  let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt the card number
function decryptCardNumber(encryptedCardNumber) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.CARD_ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedCardNumber, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Function to encrypt the CVV
function encryptCVV(cvv) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.CARD_ENCRYPTION_KEY);
  let encrypted = cipher.update(cvv, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt the CVV
function decryptCVV(encryptedCVV) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.CARD_ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedCVV, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Hide sensitive fields when converting the document to JSON
cardSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.cardNumber;
    delete ret.cvv;
    return ret;
  }
});

module.exports = mongoose.model('Card', cardSchema);
