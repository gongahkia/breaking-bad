"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { calculateOption } from "../app/actions/calculate"
import StockTicker from "./StockTicker"

interface CalculationResult {
  callOptionPrice: string
  putOptionPrice: string
  impliedVolatility: string
  delta: string
  timestamp: string
}

export default function OptionCalculator() {
  const [volatilityPercent, setVolatilityPercent] = useState(16)
  const [interestRatePercent, setInterestRatePercent] = useState(5)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [priceMode, setPriceMode] = useState<"auto" | "manual">("auto")
  const [tickerInput, setTickerInput] = useState("AAPL")
  const [submittedTicker, setSubmittedTicker] = useState("")
  const [autoPrice, setAutoPrice] = useState<number | null>(null)
  const [manualPrice, setManualPrice] = useState("100")

  async function handleCalculate() {
    setIsCalculating(true)
    setError(null)
    try {
      const stockPrice = priceMode === "auto" ? (autoPrice !== null ? autoPrice : 0) : Number(manualPrice)
      const strikePrice = Number((document.getElementById("strike-price") as HTMLInputElement).value)
      const interestRate = interestRatePercent / 100
      const dividendYield = Number((document.getElementById("dividend-yield") as HTMLInputElement).value)
      const timeToExpiration = Number((document.getElementById("expiration-time") as HTMLInputElement).value)
      const volatility = volatilityPercent / 100

      const inputs = {
        stockPrice,
        strikePrice,
        interestRate,
        dividendYield,
        timeToExpiration,
        volatility,
      }

      const result = await calculateOption(inputs)
      setResult(result)
    } catch (err) {
      setError("Failed to calculate option prices. Please check your inputs.")
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Mode Toggle */}
      <div className="flex items-center justify-center space-x-6 mb-8">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            value="auto"
            checked={priceMode === "auto"}
            onChange={() => setPriceMode("auto")}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${priceMode === "auto" ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner" : "bg-gray-200 shadow"}`}
          >
            {priceMode === "auto" && <div className="w-2 h-2 rounded-full bg-white"></div>}
          </div>
          <span className="text-gray-700 font-medium">Current Stock Price</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            value="manual"
            checked={priceMode === "manual"}
            onChange={() => setPriceMode("manual")}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${priceMode === "manual" ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner" : "bg-gray-200 shadow"}`}
          >
            {priceMode === "manual" && <div className="w-2 h-2 rounded-full bg-white"></div>}
          </div>
          <span className="text-gray-700 font-medium">Manual Stock Price</span>
        </label>
      </div>

      {/* Section for auto vs. manual price selection */}
      {priceMode === "auto" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-gray-700">Enter Ticker:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="AAPL"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubmittedTicker(tickerInput)}
              className="px-6 py-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:shadow-[1px_1px_3px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] transition-all duration-200"
            >
              Submit
            </motion.button>
          </div>
          <p className="text-sm text-gray-500">
            Note: Due to Alpha Vantage's 25 request/day limit, stock data is only fetched when you submit a ticker.
          </p>
          {submittedTicker ? (
            <div className="mt-4 p-5 rounded-xl bg-gray-100 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)]">
              <StockTicker ticker={submittedTicker} onPriceUpdate={(price) => setAutoPrice(price)} />
            </div>
          ) : (
            <p className="text-gray-500 italic">Enter a ticker and submit to load stock data.</p>
          )}
          {autoPrice !== null && (
            <div className="mt-4">
              <label htmlFor="initial-price" className="block text-sm font-medium text-gray-700 mb-2">
                Initial Stock Price (S0)
              </label>
              <input
                type="text"
                id="initial-price"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium border-none focus:outline-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
                value={autoPrice}
                disabled={true}
              />
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label htmlFor="manual-price" className="block text-sm font-medium text-gray-700 mb-2">
            Initial Stock Price (S0)
          </label>
          <input
            type="text"
            id="manual-price"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
          />
        </motion.div>
      )}

      {/* The rest of your Option Calculator inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <label htmlFor="strike-price" className="block text-sm font-medium text-gray-700 mb-2">
            Strike Price (X)
          </label>
          <input
            type="text"
            id="strike-price"
            defaultValue="100"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
          />
        </div>

        <div>
          <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-2">
            Risk-free Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              id="interest-rate"
              value={interestRatePercent}
              onChange={(e) => setInterestRatePercent(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">%</div>
          </div>
        </div>

        <div>
          <label htmlFor="dividend-yield" className="block text-sm font-medium text-gray-700 mb-2">
            Dividend Yield (q)
          </label>
          <input
            type="text"
            id="dividend-yield"
            defaultValue="0"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
          />
        </div>

        <div>
          <label htmlFor="expiration-time" className="block text-sm font-medium text-gray-700 mb-2">
            Time to Expiration (t in years)
          </label>
          <input
            type="text"
            id="expiration-time"
            defaultValue="1"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
          />
        </div>

        <div>
          <label htmlFor="volatility" className="block text-sm font-medium text-gray-700 mb-2">
            Expected Volatility (%)
          </label>
          <div className="relative">
            <input
              type="number"
              id="volatility"
              value={volatilityPercent}
              onChange={(e) => setVolatilityPercent(Number(e.target.value))}
              step="0.1"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">%</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCalculate}
          disabled={isCalculating}
          className="px-8 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium text-lg shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all duration-200 disabled:opacity-70"
        >
          {isCalculating ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculating...
            </div>
          ) : (
            "Calculate"
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 p-5 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)]"
        >
          <div className="text-sm text-red-700">{error}</div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-xl bg-gray-100 p-6 shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)]"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>
          <div className="space-y-4">
            {[
              { label: "Call Option Price", value: `$${result.callOptionPrice}` },
              { label: "Put Option Price", value: `$${result.putOptionPrice}` },
              { label: "Implied Volatility", value: result.impliedVolatility },
              { label: "Delta", value: result.delta },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-3 rounded-lg bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.5)] flex justify-between"
              >
                <span className="text-gray-700 font-medium">{label}</span>
                <span className="text-blue-600 font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">Last calculated at {new Date(result.timestamp).toLocaleString()}</p>
        </motion.div>
      )}
    </div>
  )
}