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
