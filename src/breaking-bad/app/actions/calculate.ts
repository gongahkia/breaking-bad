"use server";

import * as ss from 'simple-statistics';

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

  // Compute d1, d2 according to the Black–Scholes model:
  const d1 =
    (Math.log(S / X) + (r - q + 0.5 * sigma * sigma) * t) /
    (sigma * Math.sqrt(t));
  const d2 = d1 - sigma * Math.sqrt(t);

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

  return {
    callOptionPrice: callOptionPrice.toFixed(2),
    putOptionPrice: putOptionPrice.toFixed(2),
    impliedVolatility: (sigma * 100).toFixed(1) + "%",
    delta: deltaCall.toFixed(3),
    timestamp: new Date().toISOString(),
    callFormula: "C = S e^(-q t) N(d1) - X e^(-r t) N(d2)",
    putFormula: "P = X e^(-r t) N(-d2) - S e^(-q t) N(-d1)",
  };
}
