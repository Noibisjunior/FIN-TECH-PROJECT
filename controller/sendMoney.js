const Transaction = require('../models/transactionModel');
const Wallet = require('../models/wallet'); 
const { getExchangeRate } = require('../utils/exchangeRateService'); 

const sendMoney = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { amount, 
        accountType, 
        accountID, 
        currency, 
        receivingCurrency, 
        description, 
        agentPhoneNumber } = req.body;

    // Validate required fields
    if (!amount || !accountType || !accountID || !currency || !receivingCurrency) {
      return res.status(400).json({
        status: 400,
        message: 'Missing required fields'
      });
    }

    // Check if user has enough balance in the specified currency
    const wallet = await Wallet.findOne({ userId, currency });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        status: 400,
        message: 'Insufficient funds'
      });
    }


// Calculate exchange rate if currencies differ
let amountReceived = amount;
if (currency !== receivingCurrency) {
  try {
    const exchangeRate = await getExchangeRate(currency, receivingCurrency);
    amountReceived = amount * exchangeRate;
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Failed to retrieve exchange rate'
    });
  }
}


    // Deduct amount from sender's wallet
    wallet.balance -= amount;
    await wallet.save();

    // Create the transaction record
    const transaction = await Transaction.create({
      userId,
      amount,
      accountType,
      accountID,
      currency,
      receivingCurrency,
      amountReceived,
      description,
      agentPhoneNumber,
      transactionDate: new Date()
    });

    
    return res.status(201).json({
      status: 201,
      message: 'You have successfully sent your fund',
      data: {
        id: transaction._id,
        transactionDate: transaction.transactionDate,
        userId: transaction.userId,
        amountReceived: transaction.amountReceived,
        receivingCurrency: transaction.receivingCurrency,
        amount: transaction.amount,
        description: transaction.description,
        accountType: transaction.accountType,
        accountID: transaction.accountID,
        agentPhoneNumber: transaction.agentPhoneNumber
      }
    });
  } catch (error) {
    console.error('Error processing transaction:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { sendMoney };
