"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { calculateOption } from "./actions/calculate";

interface CalculationResult {
  callOptionPrice: string;
  putOptionPrice: string;
  impliedVolatility: string;
  delta: string;
  timestamp: string;
}

export default function OptionCalculator() {
  const [volatility, setVolatility] = useState(0.16);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCalculate() {
    setIsCalculating(true);
    setError(null);

    try {
      const stockPrice = Number.parseFloat(
        (document.getElementById("stock-price") as HTMLInputElement).value
      );
      const strikePrice = Number.parseFloat(
        (document.getElementById("strike-price") as HTMLInputElement).value
      );
      const interestRate = Number.parseFloat(
        (document.getElementById("interest-rate") as HTMLInputElement).value
      );
      const dividendYield = Number.parseFloat(
        (document.getElementById("dividend-yield") as HTMLInputElement).value
      );
      const timeToExpiration = Number.parseFloat(
        (document.getElementById("expiration-time") as HTMLInputElement).value
      );

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Option Pricing Calculator
      </h1>

      <p className="text-center text-gray-600 mb-4">
        Enter the values below to calculate option prices.
      </p>

      <div className="space-y-6">
        {/* Input Fields */}
        {[
          { id: "stock-price", label: "Initial Stock Price (S0):", defaultValue: "100" },
          { id: "strike-price", label: "Strike Price (X):", defaultValue: "100" },
          { id: "interest-rate", label: "Risk-free Interest Rate (r):", defaultValue: "0.05", step: "0.01" },
          { id: "dividend-yield", label: "Dividend Yield (q):", defaultValue: "0", step: "0.01" },
          { id: "expiration-time", label: "Time to Expiration (t in years):", defaultValue: "1", step: "0.1" },
        ].map(({ id, label, defaultValue, step }) => (
          <div key={id} className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type="number"
              id={id}
              defaultValue={defaultValue}
              step={step || undefined}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
        ))}

        {/* Volatility Input */}
        <div className="space-y-2">
          <label htmlFor="volatility" className="block text-sm font-medium text-gray-700">
            Expected Volatility (v):
          </label>
          <input
            type="number"
            id="volatility"
            value={volatility}
            onChange={(e) => setVolatility(Number(e.target.value))}
            step="0.01"
            className="w-full h-10 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
          <input
            type="range"
            value={volatility}
            onChange={(e) => setVolatility(Number(e.target.value))}
            min="0"
            max="1"
            step="0.01"
            className="w-full mt-2"
          />
          <div className="text-sm text-gray-500">{volatility.toFixed(2)}</div>
        </div>

        {/* Calculate Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCalculate}
          disabled={isCalculating}
          className={`w-full h-12 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 ${
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
            className="text-red-500 text-center text-sm"
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
            className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold text-green-700">Results:</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
              {[
                { label: "Call Option Price", value: `$${result.callOptionPrice}` },
                { label: "Put Option Price", value: `$${result.putOptionPrice}` },
                { label: "Implied Volatility", value: result.impliedVolatility },
                { label: "Delta", value: result.delta },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-indigo-600">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-right">
              Last calculated at {new Date(result.timestamp).toLocaleString()}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
