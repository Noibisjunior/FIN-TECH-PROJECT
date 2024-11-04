const Invoice = require('../models/customersInvoice'); 
const generateShareableLink = require('../utils/shareableLink'); 

const createInvoice = async (req, res) => {
  try {
    const { customer, items, currency, issueDate, dueDate } = req.body;


    const invoice = await Invoice.create({
      userId: req.user.id,
      customer,
      items,
      currency,
      issueDate,
      dueDate,
    });


    const shareableLink = generateShareableLink(invoice.id);


    return res.status(201).json({
      status: 201,
      message: 'Invoice created successfully',
      data: {
        shareable: shareableLink,
        customer,
        items,
        currency,
        issueDate,
        dueDate,
      },
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};



const getAllInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token
    const page = parseInt(req.query.page) || 0; 
    const size = parseInt(req.query.size) || 10; 

    
    const offset = page * size;

    
    const invoices = await Invoice.find({ userId })
      .skip(offset)
      .limit(size)
      .select('id shareable customer currency issueDate dueDate') // Retrieve only necessary fields
      .exec();

    
    const formattedInvoices = invoices.map(invoice => ({
        id: invoice._id,
      shareable: `<https://link-to-view-invoice.com/${invoice._id}>`, 
      customer: {
        name: invoice.customer.name,
        email: invoice.customer.email,
        address: invoice.customer.address
      },
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate
    }));

    return res.status(200).json({
      status: 200,
      message: 'Retrieved all paginated invoices successfully',
      data: formattedInvoices
    });
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};


const viewDraftInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes middleware has set req.user.id from the user token
    const { page = 0, size = 10, status = 'draft' } = req.query;

    // valid pagination parameters
    const limit = parseInt(size);
    const skip = parseInt(page) * limit;

    // Fetch draft invoices for the user with pagination
    const invoices = await Invoice.find({ userId, status: 'draft' })
      .skip(skip)
      .limit(limit);


    const formattedInvoices = invoices.map(invoice => ({
      id: invoice._id,
      shareable: `<https://link-to-view-invoice.com/${invoice._id}>`, // Updating actual link generation
      customer: {
        name: invoice.customer.name,
        email: invoice.customer.email,
        address: invoice.customer.address
      },
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate
    }));

    return res.status(200).json({
      status: 200,
      message: "Retrieved all paginated invoices successfully",
      data: formattedInvoices
    });
  } catch (error) {
    console.error('Error retrieving draft invoices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};



module.exports = { createInvoice, getAllInvoices, viewDraftInvoices };
