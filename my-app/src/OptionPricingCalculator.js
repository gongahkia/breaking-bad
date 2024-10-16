// src/OptionPricingCalculator.js
import React, { useState } from 'react';
import './OptionPricingCalculator.css'; // Import the CSS file

function OptionPricingCalculator() {
  // State variables to hold user inputs
  const [S0, setS0] = useState(100); // Initial stock price
  const [X, setX] = useState(100); // Strike price
  const [r, setR] = useState(0.05); // Risk-free interest rate
  const [q, setQ] = useState(0); // Dividend yield
  const [t, setT] = useState(1); // Time to expiration
  const [v, setV] = useState(0.2); // Volatility

  // State variables for results and error messages
  const [result, setResult] = useState({ C: null, P: null });
  const [error, setError] = useState(null);

  // Function to handle the calculation when the button is clicked
  const handleCalculate = async () => {
    // Prepare the data to be sent to the backend
    const payload = { S0, X, r, q, t, v };

    try {
      // Make a POST request to the backend
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Update state based on the response
      if (response.ok) {
        setResult({ C: data.C, P: data.P });
        setError(null);
      } else {
        setError(data.error);
        setResult({ C: null, P: null });
      }
    } catch (err) {
      setError('Error connecting to the server.');
      setResult({ C: null, P: null });
    }
  };

  return (
    <div className="container">
      <h1 className="title">Option Pricing Calculator</h1>

      {/* Introduction to the Black-Scholes Model */}
      <div className="introduction">
        <p>
          Welcome to the Option Pricing Calculator! This project uses the Black-Scholes model to calculate the prices of European call and put options. The Black-Scholes model is a mathematical model that helps in estimating the fair value of options, taking into account factors such as the current stock price, strike price, time to expiration, risk-free interest rate, volatility, and dividend yield.
        </p>
        <p>
          Please enter the parameters below to see the estimated prices for both call and put options.
        </p>
      </div>

      {/* Input fields for user to enter parameters */}
      <div className="form-group">
        <label>
          Initial Stock Price (S0):
          <input
            type="number"
            value={S0}
            onChange={(e) => setS0(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Strike Price (X):
          <input
            type="number"
            value={X}
            onChange={(e) => setX(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Risk-free Interest Rate (r):
          <input
            type="number"
            step="0.01"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Dividend Yield (q):
          <input
            type="number"
            step="0.01"
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Time to Expiration (t in years):
          <input
            type="number"
            step="0.01"
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Expected Volatility (v):
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
          />
          <span>{v.toFixed(2)}</span>
        </label>
      </div>

      {/* Button to trigger the calculation */}
      <button className="calculate-button" onClick={handleCalculate}>Calculate</button>

      {/* Display error message if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Display the results if available */}
      {result.C !== null && result.P !== null && (
        <div className="results">
          <h2>Results:</h2>
          <p>Call Option Price (C): {result.C.toFixed(4)}</p>
          <p>Put Option Price (P): {result.P.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default OptionPricingCalculator;