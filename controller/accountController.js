const Account = require('../models/AccountModel'); 

const createDummyAccount = async (userId) => {
  //dummy account
  await Account.create({
    userId,
    currency: 'USD',
    accountHolder: 'Default User',
    bankName: 'Dummy Bank',
    accountNumber: '1234567890',
    routingNumber: '0987654321',
    accountType: 'Checking',
    address: '1234 Default Street, Default City, 00000, USA'
  });
};

const getUserAccounts = async (req, res) => {
  try {
    const userId = req.user.id;    
    let accounts = await Account.find({ userId });

    // If no accounts are found, create a dummy account for the user
    if (!accounts || accounts.length === 0) {
      await createDummyAccount(userId);
      // Retrieve the newly created dummy account
      accounts = await Account.find({ userId });
    }

    // Format the response data as required
    const formattedAccounts = accounts.map(account => ({
      currency: account.currency,
      accountHolder: account.accountHolder,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      routingNumber: account.routingNumber,
      accountType: account.accountType,
      address: account.address
    }));

    return res.status(200).json({
      status: 200,
      message: 'All balances retrieved successfully',
      data: {
        accounts: formattedAccounts
      }
    });
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { getUserAccounts };











/*
const getUserAccounts = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the request 
    
    // Fetch the user's accounts from the database
    const accounts = await Account.find({ userId });

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No accounts found for user'
      });
    }

    // Format the response data as required
    const formattedAccounts = accounts.map(account => ({
      currency: account.currency,
      accountHolder: account.accountHolder,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      routingNumber: account.routingNumber,
      accountType: account.accountType,
      address: account.address
    }));

    return res.status(200).json({
      status: 200,
      message: 'All balances retrieved successfully',
      data: {
        accounts: formattedAccounts
      }
    });
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { getUserAccounts };
*/