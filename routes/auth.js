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
const { getAccountById } = require('../controller/IndividualAccount.js');
const { createInvoice } = require('../controller/userInvoice.js');
const {  getAllInvoices } = require('../controller/userInvoice.js');
const {  viewDraftInvoices } = require('../controller/userInvoice.js');
const {  pendingInvoices } = require('../controller/userInvoice.js');
const {  getDueInvoices } = require('../controller/userInvoice.js');
const {  overDueInvoices } = require('../controller/userInvoice.js');
const {  deleteInvoice } = require('../controller/userInvoice.js');
const {  createCard } = require('../controller/card.js');
const {  getAllCards } = require('../controller/card.js');
const {   getCardById } = require('../controller/card.js');
const {   getCurrentBalance } = require('../controller/walletBalance.js');
const {   getCurrentBalance } = require('../controller/walletBalance.js');
const {   getAccountStatement  } = require('../controller/walletBalance.js');
const {  deleteCard } = require('../controller/card.js');





// Creating POST routes
router.route('/api/auth/register').post(register);
router.route('/api/auth/login').post(login);
router.route('/api/auth/forgot-password').post(forgotPassword);
router.route('/api/auth/reset-password/:tokens').post(resetPassword);
router.route('/api/auth/logOut').post(logOut)
router.route('/api/userInvoices').post(verifyToken, createInvoice);
router.route('/api/createCard').post(verifyToken, createCard);

// Creating GET routes
router.route('/api/users/balances').get(verifyToken,getUserBalances);
router.route('/api/accounts').get(verifyToken,getUserAccounts);
router.route('/api/invoices/summary').get(verifyToken,getInvoiceSummary);
router.route('/api/rates').get(getCurrentExchangeRates);
router.route('/api/cards').get(verifyToken,getActiveVirtualCard );
router.route('/api/accounts/:id').get(getAccountById);
router.route('/api/getAllInvoices').get(verifyToken,getAllInvoices);
router.route('/api/viewDraftInvoices').get(verifyToken,viewDraftInvoices);
router.route('/api/pendingInvoices').get(verifyToken,pendingInvoices);
router.route('/api/dueInvoices').get(verifyToken,getDueInvoices);
router.route('/api/overdueInvoices').get(verifyToken,overDueInvoices);
router.route('/api/getAllCards').get(verifyToken,getAllCards);
router.route('/api/cards/:id').get(verifyToken, getCardById);
router.route('/api/wallets/balance').get(verifyToken, getCurrentBalance);
router.route('/api/wallets/statements').get(verifyToken, getAccountStatement );


router.route('/api/invoices/:id').delete(verifyToken,deleteInvoice);
router.route('/api/card/:id').delete(verifyToken,deleteCard);

module.exports = router;









// router.post('/api/auth/forgot-password', forgotPassword);
// router.post('/api/auth/reset-password/:token', resetPassword);

// Creating GET routes
// router.route('/api/auth/login').get(login);
// router.route('/api/auth/register').get(register);

