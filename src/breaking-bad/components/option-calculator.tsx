"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { calculateOption } from "../app/actions/calculate"
import StockTicker from "./StockTicker"
import HeatMap from "./VolatilityHeatMap"
import TradingRecommendations from "./TradingRecommendations"
import { CalculationResult, FormData, OptionInputs } from "./types"

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

  const resultsRef = useRef<HTMLDivElement>(null)

  const handleFormDataChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateInputs = (): string | null => {
    const stockPrice = priceMode === "auto" ? autoPrice : Number(manualPrice)
    const strikePrice = Number(formData.strikePrice)
    const timeToExpiration = Number(formData.timeToExpiration)
    const dividendYield = Number(formData.dividendYield)
    if (!stockPrice || stockPrice <= 0) return "Stock price must be a positive number"
    if (!strikePrice || strikePrice <= 0) return "Strike price must be a positive number"
    if (!timeToExpiration || timeToExpiration <= 0) return "Time to expiration must be a positive number"
    if (dividendYield < 0) return "Dividend yield cannot be negative"
    if (volatilityPercent <= 0) return "Volatility must be a positive number"
    if (interestRatePercent < 0) return "Interest rate cannot be negative"
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
      const inputs = { stockPrice, strikePrice, interestRate, dividendYield, timeToExpiration, volatility }
      const calculationResult = await calculateOption(inputs)
      setResult(calculationResult)
    } catch (err) {
      setError("Failed to calculate option prices. Please check your inputs and try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleTickerSubmit = () => {
    if (tickerInput.trim()) setSubmittedTicker(tickerInput.trim())
  }

  const canCalculate = priceMode === "manual" || (priceMode === "auto" && autoPrice !== null)

  const getOptionInputs = (): OptionInputs => {
    const stockPrice = priceMode === "auto" ? (autoPrice || 0) : Number(manualPrice)
    return {
      stockPrice,
      strikePrice: Number(formData.strikePrice),
      interestRate: interestRatePercent / 100,
      dividendYield: Number(formData.dividendYield),
      timeToExpiration: Number(formData.timeToExpiration),
      volatility: volatilityPercent / 100,
    }
  }

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [result])

  return (
    <div className="flex h-full gap-8 overflow-hidden">
      {/* Left Panel - Input Form */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-8">
          {[
            { label: "Current Stock Price", value: "auto" },
            { label: "Manual Stock Price", value: "manual" }
          ].map(opt => (
            <label key={opt.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="priceMode"
                value={opt.value}
                checked={priceMode === opt.value}
                onChange={() => setPriceMode(opt.value as "auto" | "manual")}
                className="sr-only"
              />
              <span className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 mr-3
                ${priceMode === opt.value
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 bg-white group-hover:border-blue-300"
                }
              `}>
                {priceMode === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-white block"></span>
                )}
              </span>
              <span className="text-gray-800 font-medium text-sm select-none">
                {opt.label}
              </span>
            </label>
          ))}
        </div>

        {/* Price Input */}
        <div className="bg-gray-50 rounded-xl p-4">
          {priceMode === "auto" ? (
            <>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Ticker Symbol
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., AAPL"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength={10}
                />
                <button
                  onClick={handleTickerSubmit}
                  disabled={!tickerInput.trim()}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium disabled:opacity-50 hover:bg-blue-600"
                >
                  Get
                </button>
              </div>
              {submittedTicker && (
                <div className="mb-3">
                  <StockTicker
                    ticker={submittedTicker}
                    onPriceUpdate={(price) => setAutoPrice(price)}
                  />
                </div>
              )}
              {autoPrice !== null && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Current Stock Price (S₀)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200"
                    value={`${autoPrice.toFixed(2)}`}
                    disabled
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Stock Price (S₀)
              </label>
              <input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter stock price"
              />
            </>
          )}
        </div>

        {/* Option Parameters Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Strike Price (K)
            </label>
            <input
              type="number"
              value={formData.strikePrice}
              onChange={(e) => handleFormDataChange("strikePrice", e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Risk-free Rate (%)
            </label>
            <input
              type="number"
              value={interestRatePercent}
              onChange={(e) => setInterestRatePercent(Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Dividend Yield (%)
            </label>
            <input
              type="number"
              value={formData.dividendYield}
              onChange={(e) => handleFormDataChange("dividendYield", e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Time to Expiration (years)
            </label>
            <input
              type="number"
              value={formData.timeToExpiration}
              onChange={(e) => handleFormDataChange("timeToExpiration", e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Volatility (%)
            </label>
            <input
              type="number"
              value={volatilityPercent}
              onChange={(e) => setVolatilityPercent(Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCalculate}
            disabled={isCalculating || !canCalculate}
            className={`
              px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200
              ${canCalculate && !isCalculating
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isCalculating ? "Calculating..." : "Calculate Options"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Right Panel - Results Card */}
      <div 
        ref={resultsRef}
        className="w-96 bg-gray-50 rounded-2xl border border-gray-200 p-6 overflow-y-auto flex-shrink-0"
      >
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-800">Results</h3>
            
            {/* Pricing Results */}
            <div className="space-y-3">
              {[
                { label: "Call Option Price", value: `${result.callOptionPrice}`, color: "text-green-600" },
                { label: "Put Option Price", value: `${result.putOptionPrice}`, color: "text-red-600" },
                { label: "Implied Volatility", value: result.impliedVolatility, color: "text-blue-600" },
                { label: "Delta", value: result.delta, color: "text-purple-600" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-white border border-gray-200 flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700 font-medium">{label}</span>
                  <span className={`font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Heat Map */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Volatility Heat Map</h4>
              <HeatMap
                optionInputs={getOptionInputs()}
                canGenerate={canCalculate && validateInputs() === null}
              />
            </div>

            {/* Trading Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Trading Recommendations</h4>
              <TradingRecommendations result={result} />
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-sm">Calculate options to see results here</p>
              <p className="text-xs mt-2">← Input parameters on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}