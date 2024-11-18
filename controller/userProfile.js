const User = require('../models/auth')

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    
    const user = await User.findById(userId).select('-password'); // Exclude sensitive fields like password

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }

    
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json({
      status: 201,
      message: "Retrieved currently logged-in user successfully",
      data: userData
    });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};


const editUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; 
    const updates = req.body; 

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true // applying validation rules
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User edited successfully",
      data: {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
        country: updatedUser.country,
        accountType: updatedUser.accountType,
        occupation: updatedUser.occupation,
        state: updatedUser.state,
        address: updatedUser.address,
        dateOfBirth: updatedUser.dateOfBirth,
        password: updatedUser.password,
        
      }
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
};



module.exports = { getCurrentUser,editUserProfile };
