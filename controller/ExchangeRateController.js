const axios = require('axios');

const getCurrentExchangeRates = async (req, res) => {
  try {
    const userCurrency = 'NGN';

    // Simulate fetching exchange rates (or replace with actual API call)
    const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${userCurrency}&access_key=35971f8110aec0cc031e38e39193a067`);

    const rates = response.data?.rates;

    if (!rates || Object.keys(rates).length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No exchange rates found'
      });
    }

    // Format the exchange rates into the required structure
    const formattedRates = Object.keys(rates).map(currency => ({
      currency,
      buyPrice: (rates[currency] * 0.98).toFixed(2),
      sellPrice: (rates[currency] * 1.02).toFixed(2)
    }));

    return res.status(200).json({
      status: 200,
      message: 'Retrieved current exchange rates successfully',
      data: {
        currency: userCurrency,
        rates: formattedRates
      }
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

module.exports = { getCurrentExchangeRates };
