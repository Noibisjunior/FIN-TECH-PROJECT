const Transaction = require('../models/transactionModel'); 

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { page = 0, size = 10, search="" ,filterBy = "" } = req.query; // Get page and size from query params 

    // Convert page and size to integers
    const pageInt = parseInt(page);
    const sizeInt = parseInt(size);


    const searchCriteria = { userId: userId };

    // Apply filtering and search only if search and filterBy are provided
    if (search && filterBy) {
      searchCriteria[filterBy] = { $regex: search, $options: "i" };
    }

    // Fetch transactions based on search criteria and pagination
    const transactions = await Transaction.find(searchCriteria)
      .skip(pageInt * sizeInt)
      .limit(sizeInt);

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      transactionDate: transaction.transactionDate,
      userId: transaction.userId,
      amountReceived: transaction.amountReceived,
      receivingCurrency: transaction.receivingCurrency,
      amount: transaction.amount
    }));

    return res.status(200).json({
      status: 200,
      message: "Retrieved all search and paginated transactions successfully",
      data: formattedTransactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};


const getTransactionById = async (req, res) => {
    try {
      const userId = req.user.id; 
      const transactionId = req.params.id; 
  
      // checking the transaction by ID and user ID to ensure the user owns this transaction
      const transaction = await Transaction.findOne({ _id: transactionId, userId: userId });
  
      if (!transaction) {
        return res.status(404).json({
          status: 404,
          message: "Transaction not found"
        });
      }
  
      const transactionData = {
        id: transaction._id,
        transactionDate: transaction.transactionDate,
        userId: transaction.userId,
        amountReceived: transaction.amountReceived,
        receivingCurrency: transaction.receivingCurrency,
        amount: transaction.amount,
      };
  
      return res.status(200).json({
        status: 200,
        message: "Retrieved a single transaction successfully",
        data: transactionData
      });
    } catch (error) {
      console.error("Error retrieving transaction:", error);
      return res.status(500).json({
        status: 500,
        message: "Server error"
      });
    }
  };
  
  


module.exports = { getAllTransactions,getTransactionById };
