const express = require('express');
const router = express.Router();

// Correct way to import functions
const { login, register, forgotPassword,resetPassword,logOut } = require('../controller/auth.js');

// Creating POST routes
router.route('/api/auth/register').post(register);
router.route('/api/auth/login').post(login);
router.route('/api/auth/forgot-password').post(forgotPassword);
router.route('/api/auth/reset-password/:tokens').post(resetPassword);

router.route('/api/auth/logOut').post(logOut)
module.exports = router;













// router.post('/api/auth/forgot-password', forgotPassword);
// router.post('/api/auth/reset-password/:token', resetPassword);

// Creating GET routes
// router.route('/api/auth/login').get(login);
// router.route('/api/auth/register').get(register);

