const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware.js');
// Correct way to import functions
const { login, 
        register, 
        forgotPassword,
        resetPassword,
        logOut } = require('../controller/auth.js');

const {getUserBalances} = require('../controller/userController.js')

// Creating POST routes
router.route('/api/auth/register').post(register);
router.route('/api/auth/login').post(login);
router.route('/api/auth/forgot-password').post(forgotPassword);
router.route('/api/auth/reset-password/:tokens').post(resetPassword);
router.route('/api/auth/logOut').post(logOut)

router.route('/api/users/balances').get(verifyToken,getUserBalances);


module.exports = router;













// router.post('/api/auth/forgot-password', forgotPassword);
// router.post('/api/auth/reset-password/:token', resetPassword);

// Creating GET routes
// router.route('/api/auth/login').get(login);
// router.route('/api/auth/register').get(register);

