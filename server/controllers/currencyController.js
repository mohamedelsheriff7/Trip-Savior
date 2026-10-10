// controllers/currencyController.js
const axios = require('axios');

// Endpoint to handle currency conversion requests
exports.convertCurrency = async (req, res) => {
    const { baseCurrency, targetCurrency, amount } = req.query;
    const apiKey = process.env.CURRENCY_API_KEY;

    try {
        // Call the currency API
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/b065f6054678880c67d96d52/latest/EGP`);
        const rate = response.data.conversion_rates[targetCurrency];

        if (!rate) {
            return res.status(400).json({ error: 'Invalid target currency' });
        }

        // Calculate the converted amount
        const convertedAmount = amount * rate;
        res.json({ convertedAmount });
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        res.status(500).json({ error: 'Error fetching exchange rate' });
    }
};
