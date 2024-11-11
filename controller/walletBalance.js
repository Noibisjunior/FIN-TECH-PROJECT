const Balance = require('../models/Balance'); 
//const Transaction = require('../models/Transaction'); 
const pdfGenerator = require('../utils/pdfGenerator'); //  utility for generating PDFs
const path = require('path');



const getCurrentBalance = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { currency } = req.query; // Extract currency from query parameters

    if (!currency) {
      return res.status(400).json({
        status: 400,
        message: 'Currency query parameter is required'
      });
    }

    // Fetch the user's balance for the specified currency
    const balanceRecord = await Balance.findOne({ userId, currency });

    if (!balanceRecord) {
      return res.status(404).json({
        status: 404,
        message: `No balance found for currency: ${currency}`
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Balance retrieved successfully',
      data: {
        balance: balanceRecord.amount.toLocaleString(), // Format number with commas
        currency: balanceRecord.currency
      }
    });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};








const getAccountStatement = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 400,
        message: 'Both startDate and endDate are required'
      });
    }

    // Retrieve transactions within the specified date range for the user
    const transactions = await Balance.find({
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Generate PDF statement
    const pdfPath = path.join(__dirname, `../public/statements/${userId}-${startDate}-to-${endDate}.pdf`);
    await pdfGenerator(transactions, startDate, endDate, pdfPath);

    // Construct download link (e.g., if hosted on server's public folder)
    const link = `${req.protocol}://${req.get('host')}/statements/${userId}-${startDate}-to-${endDate}.pdf`;

    return res.status(200).json({
      status: 200,
      message: 'Statement retrieved successfully',
      data: {
        link,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Error retrieving account statement:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};






module.exports = { getCurrentBalance,
  getAccountStatement};
