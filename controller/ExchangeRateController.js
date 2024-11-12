const axios = require('axios');
require('dotenv').config();



const getCurrentExchangeRates = async (req, res) => {
  try {
    // User's local currency, fallback to 'USD' if not available
    const userCurrency = req.user?.localCurrency || 'USD';

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${userCurrency}`);
    const rates = response.data?.conversion_rates;

    // Check if rates are defined and not empty
    if (!rates || Object.keys(rates).length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No exchange rates found',
      });
    }

    // Format the exchange rates
    const formattedRates = Object.keys(rates).map(currency => ({
      currency,
      buyPrice: (rates[currency] * 0.98).toFixed(2),  // Simulate buy price with a 2% reduction
      sellPrice: (rates[currency] * 1.02).toFixed(2)  // Simulate sell price with a 2% increase
    }));

    return res.status(200).json({
      status: 200,
      message: 'Retrieved current exchange rates successfully',
      data: {
        currency: userCurrency,
        rates: formattedRates,
      },
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};

module.exports = { getCurrentExchangeRates };
