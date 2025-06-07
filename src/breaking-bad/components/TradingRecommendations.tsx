"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalculationResult, OptionRecommendation } from "./types"

interface TradingRecommendationsProps {
  result: CalculationResult | null
}

export default function TradingRecommendations({ result }: TradingRecommendationsProps) {
  const [marketCallPrice, setMarketCallPrice] = useState("")
  const [marketPutPrice, setMarketPutPrice] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [recommendations, setRecommendations] = useState<OptionRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  // Generate recommendations based on market prices
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

    const recommendations: OptionRecommendation[] = []

    // Call option recommendation
    const callDifference = theoreticalCall - marketCall
    const callPercentDiff = Math.abs(callDifference) / marketCall * 100

    let callAction: 'buy' | 'sell' | 'hold' = 'hold'
    let callConfidence: 'high' | 'medium' | 'low' = 'low'
    let callReason = ''

    if (callDifference > 0) {
      if (callPercentDiff > 10) {
        callAction = 'buy'
        callConfidence = 'high'
        callReason = `Market is undervaluing the call by ${callPercentDiff.toFixed(1)}%. Strong buy opportunity.`
      } else if (callPercentDiff > 5) {
        callAction = 'buy'
        callConfidence = 'medium'
        callReason = `Market is undervaluing the call by ${callPercentDiff.toFixed(1)}%. Moderate buy opportunity.`
      } else {
        callReason = `Call is fairly valued. Price difference is only ${callPercentDiff.toFixed(1)}%.`
      }
    } else {
      if (callPercentDiff > 10) {
        callAction = 'sell'
        callConfidence = 'high'
        callReason = `Market is overvaluing the call by ${callPercentDiff.toFixed(1)}%. Consider selling.`
      } else if (callPercentDiff > 5) {
        callAction = 'sell'
        callConfidence = 'medium'
        callReason = `Market is overvaluing the call by ${callPercentDiff.toFixed(1)}%. Moderate sell opportunity.`
      } else {
        callReason = `Call is fairly valued. Price difference is only ${callPercentDiff.toFixed(1)}%.`
      }
    }

    recommendations.push({
      type: 'call',
      action: callAction,
      reason: callReason,
      confidence: callConfidence,
      theoreticalPrice: theoreticalCall,
      marketPrice: marketCall,
      priceDifference: callDifference
    })

    // Put option recommendation
    const putDifference = theoreticalPut - marketPut
    const putPercentDiff = Math.abs(putDifference) / marketPut * 100

    let putAction: 'buy' | 'sell' | 'hold' = 'hold'
    let putConfidence: 'high' | 'medium' | 'low' = 'low'
    let putReason = ''

    if (putDifference > 0) {
      if (putPercentDiff > 10) {
        putAction = 'buy'
        putConfidence = 'high'
        putReason = `Market is undervaluing the put by ${putPercentDiff.toFixed(1)}%. Strong buy opportunity.`
      } else if (putPercentDiff > 5) {
        putAction = 'buy'
        putConfidence = 'medium'
        putReason = `Market is undervaluing the put by ${putPercentDiff.toFixed(1)}%. Moderate buy opportunity.`
      } else {
        putReason = `Put is fairly valued. Price difference is only ${putPercentDiff.toFixed(1)}%.`
      }
    } else {
      if (putPercentDiff > 10) {
        putAction = 'sell'
        putConfidence = 'high'
        putReason = `Market is overvaluing the put by ${putPercentDiff.toFixed(1)}%. Consider selling.`
      } else if (putPercentDiff > 5) {
        putAction = 'sell'
        putConfidence = 'medium'
        putReason = `Market is overvaluing the put by ${putPercentDiff.toFixed(1)}%. Moderate sell opportunity.`
      } else {
        putReason = `Put is fairly valued. Price difference is only ${putPercentDiff.toFixed(1)}%.`
      }
    }

    recommendations.push({
      type: 'put',
      action: putAction,
      reason: putReason,
      confidence: putConfidence,
      theoreticalPrice: theoreticalPut,
      marketPrice: marketPut,
      priceDifference: putDifference
    })

    setRecommendations(recommendations)
    setShowRecommendations(true)
  }

  if (!result) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Market Price Inputs for Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Analysis & Recommendations</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter current market prices to get buy/sell recommendations based on theoretical values:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Call Option Price
            </label>
            <input
              type="number"
              value={marketCallPrice}
              onChange={(e) => setMarketCallPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="Enter market call price"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Put Option Price
            </label>
            <input
              type="number"
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

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
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
                  p-4 rounded-lg border-l-4 ${
                    rec.action === 'buy' ? 'border-green-500 bg-green-50' :
                    rec.action === 'sell' ? 'border-red-500 bg-red-50' :
                    'border-gray-500 bg-gray-50'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold capitalize text-gray-800">
                      {rec.type} Option
                    </span>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium uppercase
                      ${rec.action === 'buy' ? 'bg-green-100 text-green-800' :
                        rec.action === 'sell' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {rec.action}
                    </span>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${rec.confidence === 'high' ? 'bg-blue-100 text-blue-800' :
                        rec.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {rec.confidence} confidence
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Price Difference</div>
                    <div className={`font-bold ${rec.priceDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rec.priceDifference > 0 ? '+' : ''}${rec.priceDifference.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{rec.reason}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Theoretical Price:</span>
                    <span className="ml-2 font-medium">${rec.theoreticalPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Market Price:</span>
                    <span className="ml-2 font-medium">${rec.marketPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              ⚠️ These recommendations are based on theoretical Black-Scholes pricing and should not be considered as financial advice.
              Always conduct your own research and consider market conditions, liquidity, and risk tolerance before trading.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}