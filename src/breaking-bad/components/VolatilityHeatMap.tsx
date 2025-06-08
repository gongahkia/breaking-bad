"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { OptionInputs } from "./types"

interface HeatMapProps {
  optionInputs: OptionInputs
  canGenerate?: boolean
  displayOnly?: boolean
}

const volatilityLevels = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

export default function HeatMap({ optionInputs, canGenerate = false, displayOnly = false }: HeatMapProps) {
  const [heatMapData, setHeatMapData] = useState<{ volatility: number; value: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Original delta calculation logic preserved
  const calculateDelta = (volatility: number) => {
    const { stockPrice, strikePrice } = optionInputs
    const moneyness = Math.abs(stockPrice - strikePrice)
    return moneyness * (volatility / 100) * (stockPrice > strikePrice ? 1 : -1)
  }

  const generateHeatMap = () => {
    if (!displayOnly && !canGenerate) return
    
    setIsLoading(true)
    const newData = volatilityLevels.map(vol => ({
      volatility: vol,
      value: calculateDelta(vol)
    }))
    
    setTimeout(() => {
      setHeatMapData(newData)
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    if (displayOnly) generateHeatMap()
  }, [optionInputs, displayOnly])

  return (
    <div className="space-y-6">
      {!displayOnly && (
        <div className="mb-6">
          <button
            onClick={generateHeatMap}
            disabled={!canGenerate || isLoading}
            className={`
              w-full px-6 py-3 rounded-xl font-semibold transition-all
              ${canGenerate && !isLoading 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Volatility Sensitivity Map"
            )}
          </button>
        </div>
      )}

      <div className="relative">
        <div className="grid grid-cols-1 gap-4">
          {heatMapData.map((data, index) => {
            const isPositive = data.value >= 0
            const barWidth = Math.min(Math.abs(data.value) * 2, 100) // Scale for visibility
            
            return (
              <motion.div 
                key={data.volatility}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-20">
                    {data.volatility}% Vol
                  </span>
                  
                  <div className="flex-1 ml-4">
                    <div className="h-8 rounded-lg bg-gray-100 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.8 }}
                        className={`
                          h-full rounded-lg 
                          ${isPositive 
                            ? 'bg-gradient-to-r from-green-400 to-green-600' 
                            : 'bg-gradient-to-r from-red-400 to-red-600'}
                        `}
                      />
                    </div>
                  </div>
                  
                  <span className={`ml-4 w-24 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{data.value.toFixed(2)}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 ml-24">
                  {isPositive ? 'Positive' : 'Negative'} delta exposure
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent opacity-25" 
               style={{ width: 'calc(100% - 8rem)', marginLeft: '6rem' }} />
        </div>
      </div>

      {!displayOnly && heatMapData.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Interpretation Guide</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"/>
              <span>Positive Delta (Long Exposure)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"/>
              <span>Negative Delta (Short Exposure)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}