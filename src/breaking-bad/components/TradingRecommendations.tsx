"use client"

import { useState, useCallback, useEffect } from "react"
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

  // Reset recommendations and market prices when result changes (new theoretical prices)
  useEffect(() => {
    setRecommendations([]);
    setShowRecommendations(false);
    setError(null);
    setMarketCallPrice(""); // Clear market prices too
    setMarketPutPrice("");
  }, [result]); // Depend on result to trigger reset

  // Memoize the generateRecommendations function
  const generateRecommendations = useCallback(() => {
    // Basic validation: ensure result is not null and has call/put prices
    if (!result || result.callOptionPrice === null || result.putOptionPrice === null || result.callOptionPrice === undefined || result.putOptionPrice === undefined) {
      setError("Theoretical option prices are not available. Please calculate them first.");
      setShowRecommendations(false);
      setRecommendations([]);
      return;
    }

    // Validate market prices
    const theoreticalCall = parseFloat(result.callOptionPrice.toString());
    const theoreticalPut = parseFloat(result.putOptionPrice.toString());
    const marketCall = parseFloat(marketCallPrice);
    const marketPut = parseFloat(marketPutPrice);

    if (isNaN(marketCall) || isNaN(marketPut) || marketCall < 0 || marketPut < 0) {
      setError("Please enter valid positive numbers for market prices.");
      setShowRecommendations(false);
      setRecommendations([]);
      return;
    }
    setError(null); // Clear previous errors

    const newRecommendations: OptionRecommendation[] = []

    // Call option recommendation
    const callDifference = theoreticalCall - marketCall
    const callPercentDiff = marketCall === 0 ? 0 : Math.abs(callDifference) / marketCall * 100

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
    } else if (callDifference < 0) {
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
    } else {
       callReason = `Call is exactly valued. Price difference is 0%.`
    }


    newRecommendations.push({
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
    const putPercentDiff = marketPut === 0 ? 0 : Math.abs(putDifference) / marketPut * 100

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
    } else if (putDifference < 0) {
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
    } else {
      putReason = `Put is exactly valued. Price difference is 0%.`
    }

    newRecommendations.push({
      type: 'put',
      action: putAction,
      reason: putReason,
      confidence: putConfidence,
      theoreticalPrice: theoreticalPut,
      marketPrice: marketPut,
      priceDifference: putDifference
    })

    setRecommendations(newRecommendations)
    setShowRecommendations(true)
  }, [result, marketCallPrice, marketPutPrice]);


  // Determine if the button should be enabled
  // This needs to be carefully constructed to avoid accessing properties of null 'result'
  const canGenerate = result && // Ensure result is not null
                      typeof result.callOptionPrice === 'number' && result.callOptionPrice !== null && // Ensure it's a number and not null
                      typeof result.putOptionPrice === 'number' && result.putOptionPrice !== null &&   // Ensure it's a number and not null
                      !isNaN(parseFloat(marketCallPrice)) && parseFloat(marketCallPrice) >= 0 &&
                      !isNaN(parseFloat(marketPutPrice)) && parseFloat(marketPutPrice) >= 0;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      {/* Market Price Inputs for Recommendations */}
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Trading Recommendations</h4>
      <p className="text-sm text-gray-600 mb-4">
        Enter current market prices to get buy/sell recommendations based on theoretical values:
      </p>

      <div className="mb-3">
        <label htmlFor="marketCallPrice" className="block text-sm font-medium text-gray-600 mb-2">
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
          className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="marketPutPrice" className="block text-sm font-medium text-gray-600 mb-2">
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
          className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={generateRecommendations}
        disabled={!canGenerate}
        className={`
          w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200
          ${canGenerate
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Generate Recommendations
      </button>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 border border-red-200 p-4 mt-4"
        >
          <p className="text-sm font-medium text-red-800">{error}</p>
        </motion.div>
      )}

      {/* Recommendations Display */}
      {showRecommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 space-y-4"
        >
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
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap items-center gap-2">
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
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-gray-600">Price Difference</div>
                  <div className={`font-bold ${rec.priceDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {rec.priceDifference > 0 ? '+' : ''}${rec.priceDifference.toFixed(2)}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-3">
                {/* Robustly parse the reason into bold/italic first sentence and rest */}
                {rec.reason.split('.').length > 1 ? (
                  <>
                    <span className="font-semibold italic">{rec.reason.split('.')[0]}.</span>
                    {rec.reason.split('.').slice(1).join('.')}
                  </>
                ) : (
                  // Fallback if there's no period to split, just bold/italic the whole thing
                  <span className="font-semibold italic">{rec.reason}</span>
                )}
              </p>

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

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              <span role="img" aria-label="warning">⚠️</span> These recommendations are based on theoretical Black-Scholes pricing and should not be considered as financial advice.
              Always conduct your own research and consider market conditions, liquidity, and risk tolerance before trading.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}