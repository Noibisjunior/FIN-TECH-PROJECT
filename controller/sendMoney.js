const Transaction = require('../models/transactionModel');
const Wallet = require('../models/wallet'); 
const { getExchangeRate } = require('../utils/exchangeRateService');
const axios = require('axios'); 
require('dotenv').config();
const Account = require('../models/AccountModel'); 
const UserBalance = require('../models/wallet'); //  User model with wallet balance
const { validationResult } = require('express-validator'); // For validating inputs


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



const fetchExchangeRate = async (userCurrency, targetCurrency) => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${userCurrency}`);
    const rates = response.data.conversion_rates;
    
    // is the target currency  available
    if (!rates[targetCurrency]) {
      throw new Error(`Conversion rate for ${targetCurrency} not available`);
    }
    
    return rates[targetCurrency];
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
};

const convertCurrency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, currency: targetCurrency } = req.body;
    const userCurrency = 'USD'; // Assuming user's local currency is USD(pending changes)
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!amount || !targetCurrency) {
      return res.status(400).json({
        status: 400,
        message: 'Amount and target currency are required'
      });
    }

  
    const exchangeRate = await fetchExchangeRate(userCurrency, targetCurrency, apiKey);
    const convertedAmount = amount * exchangeRate;

    // convert record (for the response)
    const conversionRecord = {
      id: 'uniqueConversionId', // Generate a unique ID for the transaction
      conversionDate: new Date(),
      currency: targetCurrency,
      amount: convertedAmount
    };

    
    return res.status(201).json({
      status: 201,
      message: 'You have successfully converted your fund',
      data: conversionRecord
    });
  } catch (error) {
    console.error('Error converting currency:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};



const depositToAccount = async (req, res) => {
  const userId = req.user.id; 

  try {
    const depositData = {
      amount: req.body.amount,
      currency: req.body.currency,
      userId: userId
      // Include additional data as required by the third-party API
    };

    // making  request to the third-party API
    const response = await axios.post('https://third-party-api.com/deposit', depositData, {
      headers: {
        'Authorization': `Bearer ${process.env.THIRD_PARTY_API_KEY}` 
      }
    });

    // Save the transaction 
    const transaction = await Transaction.create({
      userId,
      amount: depositData.amount,
      currency: depositData.currency,
      status: 'pending', // Mark as pending until webhook confirms success
      type: 'deposit'
    });

    
    res.status(201).json({
      status: 201,
      message: 'Deposit request initiated successfully. Awaiting confirmation.',
      data: {
        transactionId: transaction._id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status
      }
    });

  } catch (error) {
    console.error('Error initiating deposit:', error);
    res.status(500).json({
      status: 500,
      message: 'Error initiating deposit request'
    });
  }
};






const withdrawFunds = async (req, res) => {
  try {
    const userId = req.user.id; 
    const {
      amount,
      accountType,
      accountID,
      currency,
      receivingCurrency,
      description,
      agentPhoneNumber
    } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, message: 'Validation error', errors: errors.array() });
    }

    // Check if the user has enough funds in the specified currency
    const user = await UserBalance.findById(userId);
    const userBalance = UserBalance.balances[currency];
    if (!userBalance || userBalance < amount) {
      return res.status(400).json({ status: 400, message: 'Insufficient funds' });
    }

    // Deducting the amount from user's balance
    userBalance.balances[currency] -= amount;
    await userBalance.save();

    const exchangeRate = await getExchangeRate(currency, receivingCurrency);
    const amountReceived = amount * exchangeRate;
    const transactionDate = new Date();
    
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
      transactionDate
    });

    
    return res.status(201).json({
      status: 201,
      message: 'You have successfully withdrawn your fund',
      data: {
        id: transaction._id,
        transactionDate,
        userId,
        amountReceived,
        receivingCurrency,
        amount,
        currency,
        description,
        accountType,
        accountID,
        agentPhoneNumber
      }
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};




module.exports = { 
  sendMoney,
  convertCurrency, 
  depositToAccount,
  withdrawFunds};
