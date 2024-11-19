const User = require('../models/auth'); 
const sendSMS = require('../utils/sendSMS'); 
const sendEmail = require('../utils/sendEmail'); 

const activate2FA = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { phoneNumber, type } = req.body;

    // Validate the type of 2FA
    const validTypes = ['text', 'email', 'authenticator'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid 2FA type. Valid types are 'text', 'email', or 'authenticator'."
      });
    }

    // Update  2FA settings
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found."
      });
    }


    switch (type) {
      case 'text':
        if (!phoneNumber) {
          return res.status(400).json({
            status: 400,
            message: "Phone number is required for text-based 2FA."
          });
        }
        user.twoFactorAuth = { method: 'text', phoneNumber };
        await sendSMS(phoneNumber, "Your 2FA setup is complete!");
        break;

      case 'email':
        user.twoFactorAuth = { method: 'email', email: user.email };
        await sendEmail(user.email, "2FA Activated", "Your 2FA setup is complete!");
        break;

      case 'authenticator':
        
        const secret = "SECRET"; 
        user.twoFactorAuth = { method: 'authenticator', secret };
        // or QRCODE
        break;

      default:
        return res.status(400).json({
          status: 400,
          message: "Invalid 2FA type."
        });
    }

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "You have successfully activated 2FA",
      data: {}
    });
  } catch (error) {
    console.error("Error activating 2FA:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};

module.exports = { activate2FA };
