// src/OptionPricingCalculator.js
import React, { useState } from 'react';

function OptionPricingCalculator() {
  const [S0, setS0] = useState(100);
  const [X, setX] = useState(100);
  const [r, setR] = useState(0.05);
  const [q, setQ] = useState(0);
  const [t, setT] = useState(1);
  const [v, setV] = useState(0.2);
  const [result, setResult] = useState({ C: null, P: null });
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    const payload = {
      S0: S0,
      X: X,
      r: r,
      q: q,
      t: t,
      v: v
    };

    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

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
    <div style={{ padding: '20px' }}>
      <h1>Option Pricing Calculator</h1>
      <div>
        <label>
          Initial Stock Price (S0):
          <input
            type="number"
            value={S0}
            onChange={(e) => setS0(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Strike Price (X):
          <input
            type="number"
            value={X}
            onChange={(e) => setX(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Risk-free Interest Rate (r):
          <input
            type="number"
            step="0.01"
            value={r}
            onChange={(e) => setR(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Dividend Yield (q):
          <input
            type="number"
            step="0.01"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Time to Expiration (t in years):
          <input
            type="number"
            step="0.01"
            value={t}
            onChange={(e) => setT(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Volatility (v):
          <input
            type="number"
            step="0.01"
            value={v}
            onChange={(e) => setV(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result.C !== null && result.P !== null && (
        <>
          <h2>Results:</h2>
          <p>Call Option Price (C): {result.C.toFixed(4)}</p>
          <p>Put Option Price (P): {result.P.toFixed(4)}</p>
        </>
      )}
    </div>
  );
}

export default OptionPricingCalculator;
