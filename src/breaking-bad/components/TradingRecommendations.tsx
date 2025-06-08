"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalculationResult, OptionRecommendation } from "./types"

interface TradingRecommendationsProps {
  result: CalculationResult | null
  displayOnly?: boolean
  recommendations?: OptionRecommendation[]
}

export default function TradingRecommendations({ 
  result, 
  displayOnly = false,
  recommendations: externalRecommendations 
}: TradingRecommendationsProps) {
  const [marketCallPrice, setMarketCallPrice] = useState("")
  const [marketPutPrice, setMarketPutPrice] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [internalRecommendations, setInternalRecommendations] = useState<OptionRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  const recommendations = displayOnly ? externalRecommendations || [] : internalRecommendations

  const generateRecommendations = async () => {
    if (!result || !marketCallPrice || !marketPutPrice) {
      setError("Please calculate theoretical prices and enter market prices first.")
      return
    }

    setError(null)

    const theoreticalCall = parseFloat(result.callOptionPrice)
    const theoreticalPut = parseFloat(result.putOptionPrice)
    const marketCall = parseFloat(marketCallPrice)
    const marketPut = parseFloat(marketPutPrice)

    const newRecommendations: OptionRecommendation[] = []

    // Call option recommendations
    if (marketCall < theoreticalCall * 0.95) {
      newRecommendations.push({
        action: 'buy',
        optionType: 'call',
        message: `Market call price ($${marketCall.toFixed(2)}) is significantly below theoretical price ($${theoreticalCall.toFixed(2)}). Strong buy opportunity.`
      })
    } else if (marketCall > theoreticalCall * 1.05) {
      newRecommendations.push({
        action: 'sell',
        optionType: 'call',
        message: `Market call price ($${marketCall.toFixed(2)}) exceeds theoretical price ($${theoreticalCall.toFixed(2)}). Consider selling calls.`
      })
    } else {
      newRecommendations.push({
        action: 'hold',
        optionType: 'call',
        message: `Market call price ($${marketCall.toFixed(2)}) aligns with theoretical price ($${theoreticalCall.toFixed(2)}). Maintain current position.`
      })
    }

    // Put option recommendations
    if (marketPut < theoreticalPut * 0.95) {
      newRecommendations.push({
        action: 'buy',
        optionType: 'put',
        message: `Market put price ($${marketPut.toFixed(2)}) is significantly below theoretical price ($${theoreticalPut.toFixed(2)}). Potential buying opportunity.`
      })
    } else if (marketPut > theoreticalPut * 1.05) {
      newRecommendations.push({
        action: 'sell',
        optionType: 'put',
        message: `Market put price ($${marketPut.toFixed(2)}) exceeds theoretical price ($${theoreticalPut.toFixed(2)}). Consider selling puts.`
      })
    } else {
      newRecommendations.push({
        action: 'hold',
        optionType: 'put',
        message: `Market put price ($${marketPut.toFixed(2)}) aligns with theoretical price ($${theoreticalPut.toFixed(2)}). Maintain current position.`
      })
    }

    setInternalRecommendations(newRecommendations)
    setShowRecommendations(true)
  }

  if (!result && !displayOnly) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Market Price Inputs for Recommendations */}
      {!displayOnly && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Analysis & Recommendations</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter current market prices to get buy/sell recommendations based on theoretical values:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="marketCallPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Market Call Option Price
              </label>
              <input
                type="number"
                id="marketCallPrice"
                value={marketCallPrice}
                onChange={(e) => setMarketCallPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter market call price"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label htmlFor="marketPutPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Market Put Option Price
              </label>
              <input
                type="number"
                id="marketPutPrice"
                value={marketPutPrice}
                onChange={(e) => setMarketPutPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter market put price"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateRecommendations}
            disabled={!marketCallPrice || !marketPutPrice}
            className={`
              w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md
              ${marketCallPrice && marketPutPrice
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Generate Recommendations
          </motion.button>
        </motion.div>
      )}

      {/* Error Message */}
      {!displayOnly && error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 border border-red-200 p-4"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {(displayOnly || showRecommendations) && recommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Trading Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`
                  p-4 rounded-lg border-l-4 
                  ${
                    rec.action === 'buy' ? 'border-green-500 bg-green-50' :
                    rec.action === 'sell' ? 'border-red-500 bg-red-50' :
                    'border-gray-500 bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${rec.action === 'buy' ? 'bg-green-100 text-green-600' :
                      rec.action === 'sell' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'}
                  `}>
                    {rec.action === 'buy' ? '🔼' : rec.action === 'sell' ? '🔽' : '⏸️'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 capitalize">{rec.optionType} option - {rec.action}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {!displayOnly && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                <span role="img" aria-label="warning">⚠️</span> These recommendations are based on theoretical Black-Scholes pricing and should not be considered as financial advice.
                Always conduct your own research and consider market conditions, liquidity, and risk tolerance before trading.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}