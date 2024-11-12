const axios = require('axios');
require('dotenv').config();

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}?apikey=${apiKey}`;

    
    const response = await axios.get(url);
    const rates = response.data.rates;

    
    const rate = rates[toCurrency];
    if (!rate) {
      throw new Error(`Unable to get currency rate from ${fromCurrency} to ${toCurrency}`);
    }

    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    throw error;
  }
};

module.exports = { getExchangeRate };
