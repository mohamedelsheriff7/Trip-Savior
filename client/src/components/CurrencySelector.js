// src/components/CurrencySelector.js
import React, { useState } from 'react';

const CurrencySelector = ({ onCurrencyChange , selectedCurrency }) => {
    const [currency, setCurrency] = useState('USD');

    const handleCurrencyChange = (event) => {
        const selectedCurrency = event.target.value;
        setCurrency(selectedCurrency);
        onCurrencyChange(selectedCurrency);
    };

    return (
        <div>
            <label htmlFor="currency">Choose Currency:</label>
            <select id="currency" value={currency} onChange={handleCurrencyChange}>
                <option value="USD">USD - US Dollar</option>
                <option value="EGP">EGP - Egyptian Pound</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                {/* Add more currencies as needed */}
            </select>
        </div>
    );
};

export default CurrencySelector;
