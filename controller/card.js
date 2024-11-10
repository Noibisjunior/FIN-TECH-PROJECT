const axios = require('axios'); 
const Card = require('../models/CardModel');

const createCard = async (req, res) => {
  const { name, type, brand, fees, walletId } = req.body;

  try {
    const userId = req.user.id; 
//payload to send to the third-party card provider
    const thirdPartyPayload = {
      name,
      type,
      brand,
      fees,
      walletId,
    };

    // Making request to the third-party API
    const thirdPartyResponse = await axios.post(
      'https://third-party-api.com/cards', // Replace with the actual endpoint
      thirdPartyPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`, 
        },
      }
    );

    // Assuming the response contains the card details in `thirdPartyResponse.data`
    const cardData = thirdPartyResponse.data;

    
    return res.status(201).json({
      status: 201,
      message: 'Card created successfully',
      data: {
        reference: cardData.reference || 'webhook unique reference', // Replace with actual field from the response
        card_reference: cardData.card_reference,
        type: cardData.type || 'virtual',
        currency: cardData.currency || 'USD',
        holder_name: cardData.holder_name || name,
        brand: cardData.brand,
        expiry_month: cardData.expiry_month,
        expiry_year: cardData.expiry_year,
        first_six: cardData.first_six,
        last_four: cardData.last_four,
        status: cardData.status || 'active',
        date: new Date().toISOString(), // or cardData.date if provided
        // Include additional fields if available in the third-party response
      },
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return res.status(500).json({
      status: 500,
      message: 'Failed to create card',
      error: error.response?.data || 'An unexpected error occurred',
    });
  }
};




const getAllCards = async (req, res) => {
  try {
    const userId = req.user.id; 
    const page = parseInt(req.query.page) || 0; 
    const size = parseInt(req.query.size) || 10; 

    // Fetch cards with pagination
    const cards = await Card.find({ userId })
      .skip(page * size)
      .limit(size);

    // Check if any cards were retrieved
    if (cards.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No cards found for user',
        data: []
      });
    }

    
    const formattedCards = cards.map(card => ({
      reference: card.reference,
      card_reference: card.card_reference,
      type: card.type,
      currency: card.currency,
      holder_name: card.holder_name,
      brand: card.brand,
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      first_six: card.first_six,
      last_four: card.last_four,
      status: card.status,
      date: card.createdAt 
    }));

    return res.status(201).json({
      status: 201,
      message: 'Retrieved all paginated cards successfully',
      data: formattedCards
    });
  } catch (error) {
    console.error('Error retrieving cards:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

 

const getCardById = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id;

    // Fetch the card by ID and ensure it belongs to the authenticated user
    const card = await Card.findOne({ _id: id, userId });

    if (!card) {
      return res.status(404).json({
        status: 404,
        message: 'Card not found'
      });
    }


    return res.status(201).json({
      status: 201,
      message: 'Retrieved a single card successfully',
      data: {
        reference: card.reference,
        card_reference: card.card_reference,
        type: card.type,
        currency: card.currency,
        holder_name: card.holder_name,
        brand: card.brand,
        expiry_month: card.expiry_month,
        expiry_year: card.expiry_year,
        first_six: card.first_six,
        last_four: card.last_four,
        status: card.status,
        date: card.date,
        
      }
    });
  } catch (error) {
    console.error('Error retrieving card:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};


const deleteCard = async (req, res) => {
    try {
      const cardId = req.params.id; 
      const userId = req.user.id; 
  
      // Find the card by ID and check if it belongs to the user
      const userCard = await Card.findOne({ _id: cardId, userId });
      if (!userCard) {
        return res.status(404).json({
          status: 404,
          message: 'card not found',
          data: {}
        });
      }
  
      
      await Card.deleteOne({ _id: cardId });
  
      return res.status(200).json({
        status: 200,
        message: 'card deleted successfully',
        data: {}
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      return res.status(500).json({
        status: 500,
        message: 'Server error',
        data: {}
      });
    }
  };
  
  
  


module.exports = { createCard,getAllCards, getCardById, deleteCard 
};
