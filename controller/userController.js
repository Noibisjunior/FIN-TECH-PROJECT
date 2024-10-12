const Balance = require('../models/Balance');



// Dummy balance creation function (temporary for testing)
const DummyBalance = async (userId) => {
  await Balance.create([
    { userId: userId, currency: 'USD', amount: 500 },
    { userId: userId, currency: 'EUR', amount: 350 },
    { userId: userId, currency: 'JPY', amount: 70000 }
  ]);
};




const getUserBalances = async (req, res) => {
  try {
    const userId = req.user.id; // get user id from the verified token
    await DummyBalance(userId);
    const balances = await Balance.find({ userId });


    
    

    if (!balances || balances.length === 0) {
      return res.status(404).json({ message: 'No balances found for user' });
    }

    res.status(200).json({
        status:200,
        message:'All balance retrieved successfully',
        data:{
            total:'5,350',
            usd:'500',
            gbp: "2,200",
            eur: "5,700",
            ngn: "2,200,000",
            currency:"USD"    
        }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserBalances };



/*// userController.js without a dummy data(it prompts the client to create account on the frontend)

const Balance = require('../models/Balance'); 

const getUserBalances = async (req, res) => {
  try {
    const userId = req.user.id; // 
    
    // Fetch the user's balances from the database
    const balances = await Balance.find({ userId });

    if (!balances || balances.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No balances found for user'
      });
    }


    let totalBalance = 0;
    const balanceData = {};
    
    // Populate balances and convert them to strings with commas for better readability
    balances.forEach(balance => {
      const currency = balance.currency.toLowerCase();
      balanceData[currency] = balance.amount.toLocaleString(); // e.g., "2,200,000"
      totalBalance += balance.amount; // Accumulate total
    });

    // Format total balance with commas and set a default currency (e.g., USD)
    const total = totalBalance.toLocaleString();
    const defaultCurrency = 'USD'; 

    return res.status(200).json({
      status: 200,
      message: 'All balances retrieved successfully',
      data: {
        total,
        ...balanceData, // Spread individual currency balances 
        currency: defaultCurrency
      }
    });
  } catch (error) {
    console.error('Error fetching user balances:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { getUserBalances };
*/ 