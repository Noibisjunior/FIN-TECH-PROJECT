const Account = require('../models/AccountModel');
const Transaction = require('../models/transactionModel');  

const getIndividualAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id; 
    const accountId = req.params.id; // Get account ID from route parameter
    const { currency } = req.query; // Get  currency from query parameter

    // Find the account by ID and user ID to ensure ownership
    let account = await Account.findOne({ _id: accountId, userId });

    
    if (!account) {
      return res.status(404).json({
        status: 404,
        message: 'Account not found'
      });
    }

    // If a currency is specified, filter to match only that currency
    if (currency && account.currency !== currency) {
      return res.status(404).json({
        status: 404,
        message: 'Account not found for specified currency'
      });
    }

    
    const accountDetails = {
      accountHolder: account.accountHolder,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      routingNumber: account.routingNumber,
      accountType: account.accountType,
      address: account.address,
      currency: account.currency
    };

    return res.status(200).json({
      status: 200,
      message: 'Balance retrieved successfully',
      data: accountDetails
    });
  } catch (error) {
    console.error('Error retrieving account details:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};




const getIncomesAndExpenses = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Fetch all transactions for the user
    const transactions = await Transaction.find({ userId });

    
    let totalIncome = 0;
    let totalExpense = 0;

    // Loop through each transaction and calculate totals based on type
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
      }
    });

    
    return res.status(200).json({
      status: 200,
      message: 'All incomes and expenses retrieved successfully',
      data: {
        income: totalIncome,
        expense: totalExpense
      }
    });
  } catch (error) {
    console.error('Error fetching incomes and expenses:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};



module.exports = { getIndividualAccountDetails,getIncomesAndExpenses };
