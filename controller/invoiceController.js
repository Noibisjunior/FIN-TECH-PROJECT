const Invoice = require('../models/invoiceModel'); 


//dummy data for testing endpoints
const createDummyInvoices = async (userId) => {
  await Invoice.create([
    { userId, status: 'due', amount: 100, dueDate: new Date('2024-11-01') },
    { userId, status: 'overdue', amount: 200, dueDate: new Date('2024-09-01') },
    { userId, status: 'pending', amount: 150, dueDate: new Date('2024-12-01') },
    { userId, status: 'pending', amount: 300, dueDate: new Date('2024-12-10') },
    { userId, status: 'due', amount: 400, dueDate: new Date('2024-10-15') },
  ]);
};

const getInvoiceSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch counts of invoices based on their status
    let dueCount = await Invoice.countDocuments({ userId, status: 'due' });
    let overdueCount = await Invoice.countDocuments({ userId, status: 'overdue' });
    let pendingCount = await Invoice.countDocuments({ userId, status: 'pending' });

    // If no invoices are found, create dummy invoices and count again
    if (dueCount === 0 && overdueCount === 0 && pendingCount === 0) {
      await createDummyInvoices(userId);
       
      // Fetch the counts again after creating dummy invoices
      dueCount = await Invoice.countDocuments({ userId, status: 'due' });
      overdueCount = await Invoice.countDocuments({ userId, status: 'overdue' });
      pendingCount = await Invoice.countDocuments({ userId, status: 'pending' });
    }

    // Structure the response
    return res.status(200).json({
      status: 200,
      message: "Retrieved invoices summaries successfully",
      data: {
        invoices: {
          due: dueCount,
          overdue: overdueCount,
          pending: pendingCount
        }
      }
    });
  } catch (error) {
    console.error('Error retrieving invoice summary:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { getInvoiceSummary };


/*
const Invoice = require('../models/Invoice'); 


const getInvoiceSummary = async (req, res) => {
  try {
    const userId = req.user.id; 
    
  const dueCount = await Invoice.countDocuments({ userId, status: 'due' });
    const overdueCount = await Invoice.countDocuments({ userId, status: 'overdue' });
    const pendingCount = await Invoice.countDocuments({ userId, status: 'pending' });

   return res.status(200).json({
      status: 200,
      message: "Retrieved invoices summaries successfully",
      data: {
        invoices: {
          due: dueCount,
          overdue: overdueCount,
          pending: pendingCount
        }
      }
    });
  } catch (error) {
    console.error('Error retrieving invoice summary:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { getInvoiceSummary };

*/