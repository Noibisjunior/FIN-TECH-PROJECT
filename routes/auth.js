const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware.js');
const { login, 
        register, 
        forgotPassword,
        resetPassword,
        logOut } = require('../controller/auth.js');

const {getUserBalances} = require('../controller/userController.js')
const {getUserAccounts} = require('../controller/accountController.js')
const {getInvoiceSummary} = require('../controller/invoiceController.js')
const {getCurrentExchangeRates} = require('../controller/ExchangeRateController.js')
const {getActiveVirtualCard } = require('../controller/virtualCard.js')


// Creating POST routes
router.route('/api/auth/register').post(register);
router.route('/api/auth/login').post(login);
router.route('/api/auth/forgot-password').post(forgotPassword);
router.route('/api/auth/reset-password/:tokens').post(resetPassword);
router.route('/api/auth/logOut').post(logOut)

router.route('/api/users/balances').get(verifyToken,getUserBalances);
router.route('/api/accounts').get(verifyToken,getUserAccounts);
router.route('/api/invoices/summary').get(verifyToken,getInvoiceSummary);
router.route('/api/rates').get(getCurrentExchangeRates);
router.route('/api/cards').get(verifyToken,getActiveVirtualCard );


module.exports = router;













// router.post('/api/auth/forgot-password', forgotPassword);
// router.post('/api/auth/reset-password/:token', resetPassword);

// Creating GET routes
// router.route('/api/auth/login').get(login);
// router.route('/api/auth/register').get(register);

