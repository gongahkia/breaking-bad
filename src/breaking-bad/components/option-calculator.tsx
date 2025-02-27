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
  const [volatilityPercent, setVolatilityPercent] = useState(16);
  const [interestRatePercent, setInterestRatePercent] = useState(5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [priceMode, setPriceMode] = useState<"auto" | "manual">("auto");
  const [tickerInput, setTickerInput] = useState("AAPL");
  const [submittedTicker, setSubmittedTicker] = useState("");
  const [autoPrice, setAutoPrice] = useState<number | null>(null);
  const [manualPrice, setManualPrice] = useState("100");

  async function handleCalculate() {
    setIsCalculating(true);
    setError(null);
    try {
      const stockPrice =
        priceMode === "auto"
          ? autoPrice !== null
            ? autoPrice
            : 0
          : Number(manualPrice);
      const strikePrice = Number((document.getElementById("strike-price") as HTMLInputElement).value);
      const interestRate = interestRatePercent / 100;
      const dividendYield = Number((document.getElementById("dividend-yield") as HTMLInputElement).value);
      const timeToExpiration = Number((document.getElementById("expiration-time") as HTMLInputElement).value);
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
    <div className="space-y-4">
      {/* Price Mode Toggle */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="auto"
            checked={priceMode === "auto"}
            onChange={() => setPriceMode("auto")}
            className="form-radio h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Current Stock Price</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="manual"
            checked={priceMode === "manual"}
            onChange={() => setPriceMode("manual")}
            className="form-radio h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Manual Stock Price</span>
        </label>
      </div>

      {/* Section for auto vs. manual price selection */}
      {priceMode === "auto" ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Enter Ticker:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="AAPL"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <button
              onClick={() => setSubmittedTicker(tickerInput)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
          <p className="text-sm text-gray-500">Note: Due to Alpha Vantage's 25 request/day limit, stock data is only fetched when you submit a ticker.</p>
          {submittedTicker ? (
            <StockTicker
              ticker={submittedTicker}
              onPriceUpdate={(price) => setAutoPrice(price)}
            />
          ) : (
            <p className="text-gray-500">Enter a ticker and submit to load stock data.</p>
          )}
          {autoPrice !== null && (
             <div>
             {/* Auto-populated Initial Stock Price (S0) */}
             <label htmlFor="initial-price" className="block text-sm font-medium text-gray-700">
             Initial Stock Price (S0)
             </label>
             <input
             type="text"
             id="initial-price"
             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
             value={autoPrice}
             disabled={true}
             />
             </div>
           )}
        </div>
      ) : (
        <div>
          <label htmlFor="manual-price" className="block text-sm font-medium text-gray-700">
            Initial Stock Price (S0)
          </label>
          <input
            type="text"
            id="manual-price"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      )}

      {/* The rest of your Option Calculator inputs */}
      <div>
        <label htmlFor="strike-price" className="block text-sm font-medium text-gray-700">
          Strike Price (X)
        </label>
        <input
          type="text"
          id="strike-price"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700">
          Risk-free Interest Rate (%)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="interest-rate"
            value={interestRatePercent}
            onChange={(e) => setInterestRatePercent(Number(e.target.value))}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            %
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="dividend-yield" className="block text-sm font-medium text-gray-700">
          Dividend Yield (q)
        </label>
        <input
          type="text"
          id="dividend-yield"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="expiration-time" className="block text-sm font-medium text-gray-700">
          Time to Expiration (t in years)
        </label>
        <input
          type="text"
          id="expiration-time"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="volatility" className="block text-sm font-medium text-gray-700">
          Expected Volatility (%)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="volatility"
            value={volatilityPercent}
            onChange={(e) => setVolatilityPercent(Number(e.target.value))}
            step="0.1"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            %
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isCalculating ? "Calculating..." : "Calculate"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Results:</h3>
          <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
            {[
              { label: "Call Option Price", value: `$${result.callOptionPrice}` },
              { label: "Put Option Price", value: `$${result.putOptionPrice}` },
              { label: "Implied Volatility", value: result.impliedVolatility },
              { label: "Delta", value: result.delta },
            ].map(({ label, value }) => (
              <div key={label} className="py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="col-span-2 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-sm text-gray-500">Last calculated at {new Date(result.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}