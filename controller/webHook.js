const Account = require('../models/AccountModel');
const Transaction = require('../models/transactionModel');

// Handling webhook to confirm deposit
const handleDepositWebhook = async (req, res) => {
  const { transactionId, status, amount, currency, userId } = req.body;

  try {
    // Check if the transaction exists and is pending
    const transaction = await Transaction.findOne({ _id: transactionId, status: 'pending' });

    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: 'Transaction not found or already processed'
      });
    }

    // Update transaction status based on webhook confirmation
    transaction.status = status;
    await transaction.save();

    // If deposit was successful, then update user's balance
    if (status === 'successful') {
      const account = await Account.findOne({ userId });
      account.balance = (account.balance || 0) + amount; 
      await account.save();
    }

    res.status(200).json({
      status: 200,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      status: 500,
      message: 'Error processing webhook'
    });
  }
};  

module.exports = { handleDepositWebhook };
