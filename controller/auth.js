const Auth = require('../models/auth');
const argon2 = require('argon2');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function register(req, res) {
    const { email, username, password, confirmPassword,accountType } = req.body;

    // Check if all fields are provided
    if (!email || !username || !password || !confirmPassword || !accountType) {
        return res.status(400).json({
            msg: 'Please provide all the required information',
        });
    }


    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json( {
            msg: 'Passwords do not match',
        });
    }
    if (!confirmPassword) {
      return res.status(400).json({
          msg: 'Please confirm your password',
      });
  }
    // Check if the user already exists
    const user = await Auth.findOne({ email });

    if (user) {
        return res.status(400).json({message:'user already exist'});
    }

    // Hash the password before saving it to the database
    const hashedPassword = await argon2.hash(password);

    // Create a new user with hashed password
    const newUser = await Auth.create({
        email,
        accountType,
        username,
        password: hashedPassword,
    });

    // Create a JWT token
    const token = JWT.sign({ userId: newUser._id }, 
        process.env.JWT_SECRET, 
        {expiresIn: '1d',}
    );

    // Send token as a cookie
    res.cookie('token', token, { secure: false, httpOnly: true });
    return res.status(200).json({
        status:200,
        message:'register succcessful',
        data:{
            token:token,
            user:{
                email:newUser.email,
                username: newUser.username,
                accountType: newUser.accountType
            }
        }
    }); // Redirect to login page
}




// Login function
 async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await Auth.findOne({ email });

        if (!user) {
            return res.status(400).json( { msg: `User doesn't exist` });
        }

        // Compare the submitted password with the hashed password in the database
        const isMatch = await argon2.verify(user.password, password);
    

        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password' });
        }

        // Create a JWT token for the logged-in user
        const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // Send token as a cookie
        // res.cookie('token', token, { secure: false, httpOnly: true });

        return res.status(200).json({
            status:200,
            message:'login succcessful',
            data:{
                token:token,
                user:{
                    email:user.email,
                    username: user.username
                }
            }
        }); // Redirect to dashboard on successful login
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            status:500,
            message:'internal server error',
        })};
    }

    async function forgotPassword (req, res)  {
        const { email } = req.body;
    
        
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email' });
        }
    
     //Generating a reset token
        const resetToken = user.createPasswordResetToken();
    
        await user.save({ validateBeforeSave: false });
    
        //  Sending the reset token to the user's email (URL should be front-end based)
        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    
        try {
            
            const transporter = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
    
            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_USERNAME,
                subject: 'Password Reset',
                html: `<p>You requested a password reset. Click this <a href="${resetURL}">link</a> to reset your password.</p>`
            };
    
            await transporter.sendMail(mailOptions);
    
            res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (error) {
            // Reset token if email sending fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
    
            return res.status(500).json({ message: 'Error sending the email. Try again later.' });
        }
    };


    // POST: Reset password
    async function resetPassword (req, res)  {
        const { tokens } = req.params;
        const { password, confirmPassword } = req.body;
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
    
        //  Finding the user by token and ensure the token is still valid
        const hashedToken = crypto.createHash('sha256').update(tokens).digest('hex');
    
        const user = await Auth.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }  // Token must not be expired
        });

// console.log('Token from URL:', tokens);
// console.log('Hashed token from URL:', hashedToken);
    
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }
    
        //  updating the password,if the token hasnt expired
        user.password = await argon2.hash(password);  // Hashing the new password
        user.resetPasswordToken = undefined;  // Clearing the reset token and expiration
        user.resetPasswordExpires = undefined;
    
      
        await user.save();
    
      
        const jwtToken = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
    
        res.status(200).json({
            status: 200,
            message: 'Password reset successfully',
            data: {
                token: jwtToken,
                user: {
                    email: user.email,
                    name: user.username,
                }
            }

        });
    };

    async function logOut(req, res) {
        // Clear the token cookie by setting it to expire in the past
        res.cookie('token', '', {
            expires: new Date(Date.now() - 1000), //  cookie expires immediately
            httpOnly: true, // Prevents JavaScript access to the cookie
            // secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        });
        
        res.status(200).json({ status: 200,message: 'Logout successful' });
    }
    

    
module.exports = { register,login,forgotPassword,resetPassword,logOut };