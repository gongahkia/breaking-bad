"use server";

import * as ss from 'simple-statistics'; // simple-statistics for normal CDF

interface OptionInputs {
  stockPrice: number;
  strikePrice: number;
  interestRate: number;
  dividendYield: number;
  timeToExpiration: number;
  volatility: number;
}

// Use simple-statistics to compute the normal CDF via the error function
function normalCDF(x: number): number {
  return 0.5 * (1 + ss.erf(x / Math.SQRT2));
}

export async function calculateOption(inputs: OptionInputs) {
  // Simulate a short delay (e.g., API call, computation time, etc.)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const {
    stockPrice: S,
    strikePrice: X,
    interestRate: r,
    dividendYield: q,
    timeToExpiration: t,
    volatility: sigma,
  } = inputs;

  // --- Start: Server-side Input Validation ---
  // Ensure all critical inputs are positive and finite numbers
  if (S <= 0 || !Number.isFinite(S) ||
      X <= 0 || !Number.isFinite(X) ||
      t <= 0 || !Number.isFinite(t) || // Time to expiration must be positive
      sigma <= 0 || !Number.isFinite(sigma) || // Volatility must be positive
      !Number.isFinite(r) ||
      !Number.isFinite(q)) {
    console.error("calculateOption: Invalid input values detected (e.g., non-positive, non-finite). Inputs:", inputs);
    return {
      callOptionPrice: null,
      putOptionPrice: null,
      impliedVolatility: null,
      delta: null,
      timestamp: new Date().toISOString(), // Still provide timestamp
      callFormula: "Error",
      putFormula: "Error",
    };
  }
  // --- End: Server-side Input Validation ---

  try {
    // Compute d1, d2 according to the Black–Scholes model:
    // Check for division by zero before hand to prevent Infinity/NaN
    const sigmaSqrtT = sigma * Math.sqrt(t);
    if (sigmaSqrtT === 0) {
        console.error("calculateOption: Division by zero in d1/d2 calculation (sigma or t is zero). Inputs:", inputs);
        return {
            callOptionPrice: null,
            putOptionPrice: null,
            impliedVolatility: null,
            delta: null,
            timestamp: new Date().toISOString(),
            callFormula: "Error",
            putFormula: "Error",
        };
    }

    const d1 =
      (Math.log(S / X) + (r - q + 0.5 * sigma * sigma) * t) / sigmaSqrtT;
    const d2 = d1 - sigmaSqrtT;

    // Discount factors
    const eNegQT = Math.exp(-q * t);
    const eNegRT = Math.exp(-r * t);

    // Calculate N(d1), N(d2), etc., using the normalCDF function from simple-statistics
    const N_d1 = normalCDF(d1);
    const N_d2 = normalCDF(d2);
    const N_negd1 = normalCDF(-d1);
    const N_negd2 = normalCDF(-d2);

    // Black–Scholes formulas for European Call/Put with continuous dividend yield:
    const callOptionPrice = S * eNegQT * N_d1 - X * eNegRT * N_d2;
    const putOptionPrice = X * eNegRT * N_negd2 - S * eNegQT * N_negd1;

    // Delta for a call option
    const deltaCall = eNegQT * N_d1;

    // --- Start: Check for NaN/Infinity results ---
    if (isNaN(callOptionPrice) || !Number.isFinite(callOptionPrice) ||
        isNaN(putOptionPrice) || !Number.isFinite(putOptionPrice) ||
        isNaN(deltaCall) || !Number.isFinite(deltaCall)) {
      console.error("calculateOption: Calculated price or delta is NaN/Infinity. Inputs:", inputs);
      return {
        callOptionPrice: null,
        putOptionPrice: null,
        impliedVolatility: null, // Return null if calculation failed
        delta: null,
        timestamp: new Date().toISOString(),
        callFormula: "Error",
        putFormula: "Error",
      };
    }
    // --- End: Check for NaN/Infinity results ---


    return {
      callOptionPrice: callOptionPrice, // Return as number
      putOptionPrice: putOptionPrice,   // Return as number
      // Implied volatility is NOT directly calculated by Black-Scholes without a market price.
      // If you're using the input `sigma` as a proxy for implied volatility, return it as a number.
      impliedVolatility: sigma * 100, // Return as number
      delta: deltaCall,                 // Return as number
      timestamp: new Date().toISOString(),
      callFormula: "C = S e^(-q t) N(d1) - X e^(-r t) N(d2)",
      putFormula: "P = X e^(-r t) N(-d2) - S e^(-q t) N(-d1)",
    };
  } catch (error) {
    console.error("calculateOption: An unexpected error occurred during calculation:", error);
    return {
      callOptionPrice: null,
      putOptionPrice: null,
      impliedVolatility: null,
      delta: null,
      timestamp: new Date().toISOString(),
      callFormula: "Error",
      putFormula: "Error",
    };
  }
}