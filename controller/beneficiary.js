const Beneficiary = require('../models/AccountModel'); 

const addBeneficiary = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { name, bankName, accountNumber, accountType, isDefault, country } = req.body;

    // Validate required fields
    if (!name || !bankName || !accountNumber || !accountType || !country) {
      return res.status(400).json({
        status: 400,
        message: "All required fields (name, bankName, accountNumber, accountType, country) must be provided"
      });
    }

    
    const beneficiary = new Beneficiary({
      userId,
      name,
      bankName,
      accountNumber,
      accountType,
      country
    });

    await beneficiary.save();

    
    return res.status(201).json({
      status: 201,
      message: "Beneficiary successfully created",
      data: {
        name: beneficiary.name,
        bankName: beneficiary.bankName,
        accountNumber: beneficiary.accountNumber,
        accountType: beneficiary.accountType,
        isDefault: beneficiary.isDefault,
        country: beneficiary.country
      }
    });
  } catch (error) {
    console.error("Error adding beneficiary:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

module.exports = { addBeneficiary };
