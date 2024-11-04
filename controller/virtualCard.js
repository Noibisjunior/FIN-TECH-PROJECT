const Card = require('../models/CardModel');

  

const createDummyCard = async (userId) => {
    
    await Card.create({
      userId,
      name: 'Test Card',
      type: 'Debit',
      brand: 'Mastercard',
      cardNumber: '1234567812345678', // Ensure you encrypt this if necessary
      cvv: '123', // Encrypt this as well if required
      expiryDate: '12/25',
      billingAddress: '123 Test Street, Test City',
      status: 'active',
    });
  };

const getActiveVirtualCard = async (req, res) => {
    try {

        // const { cardNumber, cvv } = req.body;
     const userId = req.user.id;
      const limit = req.query.limit || 1; 
// Find active virtual card for the user
const activeCard = await Card.find({
    userId: userId,
    status: 'active'
  }) 
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));


      
        
          
        /*if (!cardNumber || cardNumber.length !== 16) {
            return res.status(400).json({ message: 'Card number must be 16 digits' });
          }
          if (!cvv || (cvv.length !== 3 && cvv.length !== 4)) {
            return res.status(400).json({ message: 'CVV must be 3 or 4 digits' });
          }*/
  
      if (!activeCard || activeCard.length === 0) {
        await createDummyCard(userId);
      }
  
      return res.status(200).json({
        status: 200,
        message: 'Retrieved active virtual card successfully',
        data: {
          name: 'Test Card',
          type: 'Debit',
          brand: 'MasterCard',
          cardNumber: 1234567812345678,
          expiryDate: 22/28,
          cvv: '...',
          billingAddress: 'San-Francisco',
        },
      });
    } catch (error) {
      console.error('Error retrieving active virtual card:', error.message);
      return res.status(500).json({
        status: 500,
        message: 'Server error',
      });
    }
  };
  
  module.exports = { getActiveVirtualCard };
  

  /*use the .select() method to include the sensitive fields*/

  /*const Card = require('./models/Card');

const getUserCard = async (userId) => {
  const card = await Card.findOne({ userId: userId, status: 'active' }).select('+cardNumber +cvv');
  if (!card) {
    throw new Error('No active card found');
  }

  // The card's cardNumber and CVV are now accessible in decrypted form.
  return card;
};*/
