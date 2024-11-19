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


const searchBeneficiaries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 0, size = 10, search = "" } = req.query;

    
    const pageInt = parseInt(page);
    const sizeInt = parseInt(size);

    
    const searchQuery = {
      userId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { bankName: { $regex: search, $options: "i" } },
        { accountNumber: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ]
    };

    // Fetch the beneficiaries using pagination
    const beneficiaries = await Beneficiary.find(searchQuery)
      .skip(pageInt * sizeInt)
      .limit(sizeInt);

  
    const formattedBeneficiaries = beneficiaries.map(beneficiary => ({
      name: beneficiary.name,
      bankName: beneficiary.bankName,
      accountNumber: beneficiary.accountNumber,
      accountType: beneficiary.accountType,
      country: beneficiary.country
    }));

    return res.status(200).json({
      status: 200,
      message: "Retrieved all searched and paginated beneficiaries successfully",
      data: formattedBeneficiaries
    });
  } catch (error) {
    console.error("Error retrieving beneficiaries:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};


const deleteBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id; 
    const beneficiaryId = req.params.id; 

    // Check if the beneficiary exists and belongs to the user
    const beneficiary = await Beneficiary.findOne({ _id: beneficiaryId, userId });
    if (!beneficiary) {
      return res.status(404).json({
        status: 404,
        message: "Beneficiary not found or does not belong to the user",
        data: {}
      });
    }

  
    await Beneficiary.deleteOne({ _id: beneficiaryId });

    return res.status(200).json({
      status: 200,
      message: "Beneficiary deleted successfully",
      data: {}
    });
  } catch (error) {
    console.error("Error deleting beneficiary:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: {}
    });
  }
};




module.exports = { addBeneficiary,searchBeneficiaries,deleteBeneficiary };
