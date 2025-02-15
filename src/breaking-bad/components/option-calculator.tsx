"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { calculateOption } from "../app/actions/calculate";
import StockTicker from "./StockTicker";

interface CalculationResult {
  callOptionPrice: string;
  putOptionPrice: string;
  impliedVolatility: string;
  delta: string;
  timestamp: string;
}

export default function OptionCalculator() {
  // Store user-facing percentage values from 0 - 100
  const [volatilityPercent, setVolatilityPercent] = useState(16); // e.g. 16% => 0.16
  const [interestRatePercent, setInterestRatePercent] = useState(5); // e.g. 5% => 0.05

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCalculate() {
    setIsCalculating(true);
    setError(null);

    try {
      // Get other inputs (already in numeric form)
      const stockPrice = Number.parseFloat(
        (document.getElementById("stock-price") as HTMLInputElement).value
      );
      const strikePrice = Number.parseFloat(
        (document.getElementById("strike-price") as HTMLInputElement).value
      );
      // Converting interest rate from 0-100% to 0-1
      const interestRate = interestRatePercent / 100;

      const dividendYield = Number.parseFloat(
        (document.getElementById("dividend-yield") as HTMLInputElement).value
      );
      const timeToExpiration = Number.parseFloat(
        (document.getElementById("expiration-time") as HTMLInputElement).value
      );
      // Converting volatility from 0-100% to 0-1
      const volatility = volatilityPercent / 100;

      const inputs = {
        stockPrice,
        strikePrice,
        interestRate,
        dividendYield,
        timeToExpiration,
        volatility,
      };

      const result = await calculateOption(inputs);
      setResult(result);
    } catch (err) {
      setError("Failed to calculate option prices. Please check your inputs.");
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl"
    >
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
        Option Pricing Calculator
      </h1>

      { /* Live Stock Ticker Embedded */ }
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Live Stock Ticker
        </h2>
        <StockTicker ticker="AAPL" />
      </section>

      <div className="space-y-8">
        {/* Stock Price */}
        <div className="space-y-2">
          <label
            htmlFor="stock-price"
            className="block text-sm font-medium text-gray-700"
          >
            Initial Stock Price (S0)
          </label>
          <input
            type="number"
            id="stock-price"
            defaultValue="100"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Strike Price */}
        <div className="space-y-2">
          <label
            htmlFor="strike-price"
            className="block text-sm font-medium text-gray-700"
          >
            Strike Price (X)
          </label>
          <input
            type="number"
            id="strike-price"
            defaultValue="100"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Interest Rate (0-100% Display) */}
        <div className="space-y-2">
          <label
            htmlFor="interest-rate"
            className="block text-sm font-medium text-gray-700"
          >
            Risk-free Interest Rate (%)
          </label>
          <input
            type="number"
            id="interest-rate"
            value={interestRatePercent}
            onChange={(e) => setInterestRatePercent(Number(e.target.value))}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-sm text-right text-gray-600">
            {interestRatePercent.toFixed(2)}%
          </p>
        </div>

        {/* Dividend Yield */}
        <div className="space-y-2">
          <label
            htmlFor="dividend-yield"
            className="block text-sm font-medium text-gray-700"
          >
            Dividend Yield (q)
          </label>
          <input
            type="number"
            id="dividend-yield"
            defaultValue="0"
            step="0.01"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Time to Expiration */}
        <div className="space-y-2">
          <label
            htmlFor="expiration-time"
            className="block text-sm font-medium text-gray-700"
          >
            Time to Expiration (t in years)
          </label>
          <input
            type="number"
            id="expiration-time"
            defaultValue="1"
            step="0.1"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Volatility (0-100% Display) */}
        <div className="space-y-2">
          <label
            htmlFor="volatility"
            className="block text-sm font-medium text-gray-700"
          >
            Expected Volatility (%)
          </label>
          <input
            type="number"
            id="volatility"
            value={volatilityPercent}
            onChange={(e) => setVolatilityPercent(Number(e.target.value))}
            step="0.1"
            className="w-full h-12 px-4 mb-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Calculate Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCalculate}
          disabled={isCalculating}
          className={`w-full h-14 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${
            isCalculating ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isCalculating ? "Calculating..." : "Calculate"}
        </motion.button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Results:
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Call Option Price", value: `$${result.callOptionPrice}` },
                { label: "Put Option Price", value: `$${result.putOptionPrice}` },
                { label: "Implied Volatility", value: result.impliedVolatility },
                { label: "Delta", value: result.delta },
              ].map(({ label, value }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-xl font-bold text-indigo-600">{value}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-6 text-right">
              Last calculated at {new Date(result.timestamp).toLocaleString()}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
