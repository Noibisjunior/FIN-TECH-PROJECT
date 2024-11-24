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
const {   getAccountStatement  } = require('../controller/walletBalance.js');
const {  deleteCard } = require('../controller/card.js');
const {  getIndividualAccountDetails } = require('../controller/walletDetails.js');
const {  getIncomesAndExpenses  } = require('../controller/walletDetails.js');
const {  sendMoney  } = require('../controller/sendMoney');
const {  convertCurrency  } = require('../controller/sendMoney');
const {  handleDepositWebhook  } = require('../controller/webHook');
const { depositToAccount  } = require('../controller/sendMoney');
const { getAllTransactions  } = require('../controller/Transaction.js');
const { getTransactionById  } = require('../controller/Transaction.js');
const {  getCurrentUser  } = require('../controller/userProfile.js');
const {  editUserProfile  } = require('../controller/userProfile.js');
const {  addBeneficiary  } = require('../controller/beneficiary.js');
const {  searchBeneficiaries  } = require('../controller/beneficiary.js');
const {  deleteBeneficiary  } = require('../controller/beneficiary.js');
const {  activate2FA  } = require('../controller/2FA.js');
const {  verifyUser  } = require('../controller/verifyUser.js');
const {  getNotificationCount  } = require('../controller/notification.js');
const {  getNotificationById } = require('../controller/notification.js');
const {  updateNotificationStatus } = require('../controller/notification.js');
const {  deleteNotification } = require('../controller/notification.js');





// Creating POST routes
router.route('/api/auth/register').post(register);
router.route('/api/auth/login').post(login);
router.route('/api/auth/forgot-password').post(forgotPassword);
router.route('/api/auth/reset-password/:tokens').post(resetPassword);
router.route('/api/auth/logOut').post(logOut)
router.route('/api/userInvoices').post(verifyToken, createInvoice);
router.route('/api/createCard').post(verifyToken, createCard);
router.route('/api/wallets/send').post(verifyToken, sendMoney);
router.route('/api/wallets/convert').post(verifyToken, convertCurrency);
router.route('/api/wallets/deposit').post(verifyToken, depositToAccount);
router.route('/api/wallets/deposit-webhook').post(handleDepositWebhook);
router.route('/api/wallets/withdraw').post();
router.route('/api/users/:id/beneficiaries').post(verifyToken,addBeneficiary);
router.route('/api/users/2fa').post(verifyToken, activate2FA);
router.route('/api/verification').post(verifyToken, verifyUser);



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
router.route('/api/wallets/accounts/:id').get(verifyToken, getIndividualAccountDetails );
router.route('/api/wallets/expenses-incomes').get(verifyToken, getIncomesAndExpenses);
router.route('/api/transactions').get(verifyToken, getAllTransactions);
router.route('/api/transactions/:id').get(verifyToken, getTransactionById);
router.route('/api/currentUser').get(verifyToken, getCurrentUser);
router.route('/api/currentUser').get(verifyToken, getCurrentUser);
router.route('/api/users/:id').get(verifyToken, editUserProfile );
router.route('/api/beneficiaries/').get(verifyToken, searchBeneficiaries );
router.route('/api/notifications/count').get(verifyToken, getNotificationCount );
router.route('/api/notifications/:id').get(verifyToken, getNotificationById );




router.route('/api/invoices/:id').delete(verifyToken,deleteInvoice);
router.route('/api/beneficiaries/:id').delete(verifyToken,deleteBeneficiary);
router.route('/api/card/:id').delete(verifyToken,deleteCard);
router.route('/api/notification/:id').delete(verifyToken,deleteNotification);


router.route('/api/notifications/:id').put(verifyToken, updateNotificationStatus );
module.exports = router;









// router.post('/api/auth/forgot-password', forgotPassword);
// router.post('/api/auth/reset-password/:token', resetPassword);

// Creating GET routes
// router.route('/api/auth/login').get(login);
// router.route('/api/auth/register').get(register);

