const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const validator = require('validator');
const crypto = require ('crypto')



const authSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  accountType:{
    type: String,
    // required: [true, 'Account type is required'],
  },
  country:{
    type: String,
    // required: [true, 'Country is required'],
  },
  country_code:{
    type: String,
  },
  state:{
type: String,
  },
  address:{
    type: String,
    // required: [true, 'Address is required'],
  },
  phoneNumber:{
    type: String,
    // required: [true, 'Phone number is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  confirmPassword: {
    type: String,
    // required: [true, 'Please confirm your password'],
    validate: {
      // Custom validator to check if passwords match
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  resetPasswordToken: {type:String},
  resetPasswordExpires: {type :Date}
});

// Middleware to hash password before saving to the database
authSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
});
authSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// Method to create a JWT for the user
authSchema.methods.createJWT = function () {
  return JWT.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

authSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');  // Generate a random token

  // Hash the token and set it on the user
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //the token get expired after 10 minutes

    return resetToken;  // Return plain token to send via email

}




module.exports = mongoose.model('Auth', authSchema);
