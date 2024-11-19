const axios = require('axios'); 

const verifyUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    // payload to send to the third-party verification service
    const verificationPayload = {
      userId,
      name: req.user.name, 
      email: req.user.email, 
    };

    // integrating third-party verification platform
    const thirdPartyResponse = await axios.post('https://third-party-verification.com/api/verify', verificationPayload, {
      headers: {
        Authorization: `Bearer api-key`, 
      },
    });

    const redirectLink = thirdPartyResponse.data.redirectLink; // redirect link from third party
    return res.status(201).json({
      status: 201,
      message: "Verification successfully created",
      data: {
        redirectLink,
      },
    });
  } catch (error) {
    console.error("Error in verification process:", error);


    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        status: error.response.status || 500,
        message: error.response.data.message || "Third-party verification error",
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

module.exports = { verifyUser };
