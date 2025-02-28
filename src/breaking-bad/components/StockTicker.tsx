"use client"

import { useEffect, useState, useRef } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"

interface StockData {
  "01. symbol"?: string
  "05. price"?: string
  "07. latest trading day"?: string
}

interface StockTickerProps {
  ticker: string
  onPriceUpdate?: (price: number) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker)

export default function StockTicker({ ticker, onPriceUpdate }: StockTickerProps) {
  const shouldFetch = isValidTicker(ticker)
  const { data, error, isLoading } = useSWR(shouldFetch ? `/api/stock?ticker=${ticker}` : null, fetcher, {
    dedupingInterval: 60000,
  })

  // State for loading bar progress
  const [loadingProgress, setLoadingProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate loading progress
  useEffect(() => {
    setLoadingProgress(0) // Reset progress on new ticker
    if (isLoading) {
      intervalRef.current = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          const newProgress = prevProgress + 5
          return newProgress > 90 ? 90 : newProgress // Cap at 90%
        })
      }, 100)
    } else {
      clearInterval(intervalRef.current)
      setLoadingProgress(100) // Set to 100% when loading is done
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLoading]) // Removed unnecessary dependency: ticker

  useEffect(() => {
    if (!isLoading && data && data["05. price"]) {
      setLoadingProgress(100) // Ensure it's 100% when data is loaded
    }
  }, [data, isLoading])

  if (!shouldFetch) {
    return (
      <div className="text-red-500 font-medium p-3 rounded-lg bg-red-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)]">
        Please enter a valid ticker symbol.
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 font-medium p-3 rounded-lg bg-red-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)]">
        Error fetching data for {ticker}.
      </div>
    )
  }

  return (
    <div>
      {/* Loading Bar */}
      {(isLoading || loadingProgress < 100) && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Fetching {ticker} data...</span>
            <span>{loadingProgress}%</span>
          </div>
          <div className="h-3 rounded-full bg-gray-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[1px_1px_3px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      )}

      {data && data["05. price"] ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2"
        >
          <div className="text-lg font-medium text-gray-700">{ticker} Stock Price</div>
          <div className="text-3xl font-bold text-blue-600 my-2">
            ${Number.parseFloat(data["05. price"]).toFixed(2)}
          </div>
          {data["07. latest trading day"] && (
            <div className="text-sm text-gray-500">Last updated: {data["07. latest trading day"]}</div>
          )}
          {/* Notify the parent component with the auto-fetched price when it changes */}
          {useEffect(() => {
            if (onPriceUpdate) {
              onPriceUpdate(Number.parseFloat(data["05. price"]))
            }
          }, [data, onPriceUpdate])}
        </motion.div>
      ) : (
        !isLoading && <div className="text-gray-500 italic">Price data is unavailable.</div>
      )}
    </div>
  )
}