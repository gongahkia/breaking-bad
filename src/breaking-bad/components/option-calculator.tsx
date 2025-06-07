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

interface FormData {
  strikePrice: string
  dividendYield: string
  timeToExpiration: string
}

export default function OptionCalculator() {
  const [volatilityPercent, setVolatilityPercent] = useState(16)
  const [interestRatePercent, setInterestRatePercent] = useState(5)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [priceMode, setPriceMode] = useState<"auto" | "manual">("auto")
  const [tickerInput, setTickerInput] = useState("AAPL")
  const [submittedTicker, setSubmittedTicker] = useState("")
  const [autoPrice, setAutoPrice] = useState<number | null>(null)
  const [manualPrice, setManualPrice] = useState("100")
  const [formData, setFormData] = useState<FormData>({
    strikePrice: "100",
    dividendYield: "0",
    timeToExpiration: "1"
  })

  const handleFormDataChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateInputs = (): string | null => {
    const stockPrice = priceMode === "auto" ? autoPrice : Number(manualPrice)
    const strikePrice = Number(formData.strikePrice)
    const timeToExpiration = Number(formData.timeToExpiration)
    const dividendYield = Number(formData.dividendYield)

    if (!stockPrice || stockPrice <= 0) {
      return "Stock price must be a positive number"
    }
    if (!strikePrice || strikePrice <= 0) {
      return "Strike price must be a positive number"
    }
    if (!timeToExpiration || timeToExpiration <= 0) {
      return "Time to expiration must be a positive number"
    }
    if (dividendYield < 0) {
      return "Dividend yield cannot be negative"
    }
    if (volatilityPercent <= 0) {
      return "Volatility must be a positive number"
    }
    if (interestRatePercent < 0) {
      return "Interest rate cannot be negative"
    }

    return null
  }

  async function handleCalculate() {
    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsCalculating(true)
    setError(null)
    
    try {
      const stockPrice = priceMode === "auto" ? (autoPrice || 0) : Number(manualPrice)
      const strikePrice = Number(formData.strikePrice)
      const interestRate = interestRatePercent / 100
      const dividendYield = Number(formData.dividendYield)
      const timeToExpiration = Number(formData.timeToExpiration)
      const volatility = volatilityPercent / 100

      const inputs = {
        stockPrice,
        strikePrice,
        interestRate,
        dividendYield,
        timeToExpiration,
        volatility,
      }

      const calculationResult = await calculateOption(inputs)
      setResult(calculationResult)
    } catch (err) {
      setError("Failed to calculate option prices. Please check your inputs and try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleTickerSubmit = () => {
    if (tickerInput.trim()) {
      setSubmittedTicker(tickerInput.trim())
    }
  }

  const canCalculate = priceMode === "manual" || (priceMode === "auto" && autoPrice !== null)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Price Mode Toggle - Simplified Radio Buttons */}
      <div className="flex items-start justify-center space-x-8 bg-gray-100 p-6 rounded-lg">
        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="priceMode"
            value="auto"
            checked={priceMode === "auto"}
            onChange={() => setPriceMode("auto")}
            className="sr-only"
          />
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mr-3
            ${priceMode === "auto" 
              ? "border-blue-500 bg-blue-500" 
              : "border-gray-400 bg-white group-hover:border-blue-300"
            }
          `}>
            {priceMode === "auto" && (
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            )}
          </div>
          <span className="text-gray-700 font-medium select-none">
            Current Stock Price
          </span>
        </label>

        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="priceMode"
            value="manual"
            checked={priceMode === "manual"}
            onChange={() => setPriceMode("manual")}
            className="sr-only"
          />
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mr-3
            ${priceMode === "manual" 
              ? "border-blue-500 bg-blue-500" 
              : "border-gray-400 bg-white group-hover:border-blue-300"
            }
          `}>
            {priceMode === "manual" && (
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            )}
          </div>
          <span className="text-gray-700 font-medium select-none">
            Manual Stock Price
          </span>
        </label>
      </div>

      {/* Price Input Section */}
      {priceMode === "auto" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Ticker Symbol:
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="e.g., AAPL"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                maxLength={10}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTickerSubmit}
                disabled={!tickerInput.trim()}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Price
              </motion.button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Note: Stock data fetching is limited to 25 requests per day
            </p>
          </div>

          {submittedTicker && (
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <StockTicker 
                ticker={submittedTicker} 
                onPriceUpdate={(price) => setAutoPrice(price)} 
              />
            </div>
          )}

          {autoPrice !== null && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock Price (S₀)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-300 cursor-not-allowed"
                value={`${autoPrice.toFixed(2)}`}
                disabled
              />
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Price (S₀)
          </label>
          <input
            type="number"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter stock price"
          />
        </motion.div>
      )}

      {/* Option Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Strike Price (K)
          </label>
          <input
            type="number"
            value={formData.strikePrice}
            onChange={(e) => handleFormDataChange("strikePrice", e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk-free Rate (%)
          </label>
          <input
            type="number"
            value={interestRatePercent}
            onChange={(e) => setInterestRatePercent(Number(e.target.value))}
            min="0"
            step="0.1"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dividend Yield (%)
          </label>
          <input
            type="number"
            value={formData.dividendYield}
            onChange={(e) => handleFormDataChange("dividendYield", e.target.value)}
            min="0"
            step="0.1"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time to Expiration (years)
          </label>
          <input
            type="number"
            value={formData.timeToExpiration}
            onChange={(e) => handleFormDataChange("timeToExpiration", e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volatility (%)
          </label>
          <input
            type="number"
            value={volatilityPercent}
            onChange={(e) => setVolatilityPercent(Number(e.target.value))}
            min="0"
            step="0.1"
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center pt-4">
        <motion.button
          whileHover={{ scale: canCalculate ? 1.02 : 1 }}
          whileTap={{ scale: canCalculate ? 0.98 : 1 }}
          onClick={handleCalculate}
          disabled={isCalculating || !canCalculate}
          className={`
            px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 shadow-lg
            ${canCalculate && !isCalculating
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isCalculating ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Calculating...
            </div>
          ) : (
            "Calculate Options"
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 border border-red-200 p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Calculation Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Call Option Price", value: `${result.callOptionPrice}`, color: "text-green-600" },
              { label: "Put Option Price", value: `${result.putOptionPrice}`, color: "text-red-600" },
              { label: "Implied Volatility", value: result.impliedVolatility, color: "text-blue-600" },
              { label: "Delta", value: result.delta, color: "text-purple-600" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center"
              >
                <span className="text-gray-700 font-medium">{label}</span>
                <span className={`font-bold text-lg ${color}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Calculated on {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}