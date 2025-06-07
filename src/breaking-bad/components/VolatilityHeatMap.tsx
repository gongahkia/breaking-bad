"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { calculateOption } from "../app/actions/calculate"
import { HeatMapData, OptionInputs } from "./types"

interface HeatMapProps {
  optionInputs: OptionInputs
  canGenerate: boolean
}

export default function HeatMap({ optionInputs, canGenerate }: HeatMapProps) {
  const [showHeatMap, setShowHeatMap] = useState(false)
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([])
  const [isGeneratingHeatMap, setIsGeneratingHeatMap] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate heat map data
  const generateHeatMap = async () => {
    if (!canGenerate) {
      setError("Please ensure all inputs are valid before generating heat map")
      return
    }

    setIsGeneratingHeatMap(true)
    setError(null)
    
    try {
      const heatMapResults: HeatMapData[] = []
      
      // Generate data for volatility range 5% to 50%
      for (let vol = 5; vol <= 50; vol += 2.5) {
        const inputs = {
          ...optionInputs,
          volatility: vol / 100,
        }

        const calculationResult = await calculateOption(inputs)
        
        heatMapResults.push({
          volatility: vol,
          callPrice: parseFloat(calculationResult.callOptionPrice),
          putPrice: parseFloat(calculationResult.putOptionPrice),
          delta: parseFloat(calculationResult.delta)
        })
      }

      setHeatMapData(heatMapResults)
      setShowHeatMap(true)
    } catch (err) {
      setError("Failed to generate heat map. Please check your inputs and try again.")
    } finally {
      setIsGeneratingHeatMap(false)
    }
  }

  // Color scale for heat map
  const getHeatMapColor = (value: number, min: number, max: number) => {
    const normalized = (value - min) / (max - min)
    const hue = (1 - normalized) * 240 // Blue to red
    return `hsl(${hue}, 70%, 50%)`
  }

  const maxCallPrice = Math.max(...heatMapData.map(d => d.callPrice))
  const minCallPrice = Math.min(...heatMapData.map(d => d.callPrice))
  const maxPutPrice = Math.max(...heatMapData.map(d => d.putPrice))
  const minPutPrice = Math.min(...heatMapData.map(d => d.putPrice))

  return (
    <div className="space-y-6">
      {/* Generate Heat Map Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: canGenerate ? 1.02 : 1 }}
          whileTap={{ scale: canGenerate ? 0.98 : 1 }}
          onClick={generateHeatMap}
          disabled={isGeneratingHeatMap || !canGenerate}
          className={`
            px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 shadow-lg
            ${canGenerate && !isGeneratingHeatMap
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isGeneratingHeatMap ? (
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
              Generating...
            </div>
          ) : (
            "Generate Volatility Heat Map"
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

      {/* Volatility Heat Map */}
      {showHeatMap && heatMapData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Volatility Sensitivity Heat Map</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Call Options Heat Map */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Call Option Prices</h4>
              <div className="space-y-2">
                {heatMapData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-12">
                      {data.volatility}%
                    </span>
                    <div className="flex-1 relative">
                      <div
                        className="h-8 rounded flex items-center justify-center text-white text-sm font-medium shadow-sm"
                        style={{
                          backgroundColor: getHeatMapColor(data.callPrice, minCallPrice, maxCallPrice),
                          width: `${((data.callPrice - minCallPrice) / (maxCallPrice - minCallPrice)) * 100}%`,
                          minWidth: '60px'
                        }}
                      >
                        ${data.callPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Min: ${minCallPrice.toFixed(2)}</span>
                <span>Max: ${maxCallPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Put Options Heat Map */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Put Option Prices</h4>
              <div className="space-y-2">
                {heatMapData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-12">
                      {data.volatility}%
                    </span>
                    <div className="flex-1 relative">
                      <div
                        className="h-8 rounded flex items-center justify-center text-white text-sm font-medium shadow-sm"
                        style={{
                          backgroundColor: getHeatMapColor(data.putPrice, minPutPrice, maxPutPrice),
                          width: `${((data.putPrice - minPutPrice) / (maxPutPrice - minPutPrice)) * 100}%`,
                          minWidth: '60px'
                        }}
                      >
                        ${data.putPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Min: ${minPutPrice.toFixed(2)}</span>
                <span>Max: ${maxPutPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delta Sensitivity Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Delta Sensitivity</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-6 gap-2 text-xs">
                {heatMapData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="text-gray-600 mb-1">{data.volatility}%</div>
                    <div className={`p-2 rounded font-medium ${
                      Math.abs(data.delta) > 0.7 ? 'bg-red-100 text-red-800' :
                      Math.abs(data.delta) > 0.3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {data.delta.toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Heat map shows how option prices change with volatility (5% to 50%). 
              Warmer colors indicate higher prices.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}