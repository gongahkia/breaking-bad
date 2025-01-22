"use client"

import { useState } from "react"
import { calculateOption } from "./actions/calculate"

interface CalculationResult {
  callOptionPrice: string
  putOptionPrice: string
  impliedVolatility: string
  delta: string
  timestamp: string
}

export default function OptionCalculator() {
  const [volatility, setVolatility] = useState(0.16)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCalculate() {
    setIsCalculating(true)
    setError(null)

    try {
      const stockPrice = Number.parseFloat((document.getElementById("stock-price") as HTMLInputElement).value)
      const strikePrice = Number.parseFloat((document.getElementById("strike-price") as HTMLInputElement).value)
      const interestRate = Number.parseFloat((document.getElementById("interest-rate") as HTMLInputElement).value)
      const dividendYield = Number.parseFloat((document.getElementById("dividend-yield") as HTMLInputElement).value)
      const timeToExpiration = Number.parseFloat((document.getElementById("expiration-time") as HTMLInputElement).value)

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
    <div className="w-full max-w-xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold text-center text-[#0088FF]">Breaking Bad's Option Pricing Calculator</h1>

      <div className="Description">
        <h3 className="Body">Values are inputted in raw value, rather then whole number percentages.</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="stock-price">Initial Stock Price (S0):</label>
          <input type="number" id="stock-price" defaultValue="100" className="w-full h-9 px-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label htmlFor="strike-price">Strike Price (X):</label>
          <input type="number" id="strike-price" defaultValue="100" className="w-full h-9 px-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label htmlFor="interest-rate">Risk-free Interest Rate (r):</label>
          <input type="number" id="interest-rate" defaultValue="0.05" step="0.01" className="w-full h-9 px-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label htmlFor="dividend-yield">Dividend Yield (q):</label>
          <input type="number" id="dividend-yield" defaultValue="0" step="0.01" className="w-full h-9 px-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label htmlFor="expiration-time">Time to Expiration (t in years):</label>
          <input type="number" id="expiration-time" defaultValue="1" step="0.1" className="w-full h-9 px-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label htmlFor="volatility">Expected Volatility (v):</label>
          <input
            type="number"
            id="volatility"
            value={volatility}
            onChange={(e) => setVolatility(Number(e.target.value))}
            step="0.01"
            className="w-full h-9 px-2 border rounded"
          />
          <div className="pt-4">
            <input
              type="range"
              value={volatility}
              onChange={(e) => setVolatility(Number(e.target.value))}
              min="0"
              max="1"
              step="0.01"
              className="w-full"
            />
          </div>
          <div className="text-sm text-gray-600">{volatility.toFixed(2)}</div>
        </div>

        <button
          className="w-full bg-[#0088FF] hover:bg-[#0066CC] text-white h-10 mt-6 rounded"
          onClick={handleCalculate}
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate"}
        </button>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        {result && (
          <div className="mt-6 border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Call Option Price</div>
                <div className="text-lg font-semibold text-[#0088FF]">${result.callOptionPrice}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Put Option Price</div>
                <div className="text-lg font-semibold text-[#0088FF]">${result.putOptionPrice}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Implied Volatility</div>
                <div className="text-lg font-semibold">{result.impliedVolatility}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Delta</div>
                <div className="text-lg font-semibold">{result.delta}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-4 text-right">
              Last calculated: {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}