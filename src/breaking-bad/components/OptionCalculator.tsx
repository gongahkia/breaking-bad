"use client"

import { useState, useEffect, useRef } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { BlackScholes } from 'your-black-scholes-library' // Import your Black-Scholes calculation library

interface StockData {
  "01. symbol"?: string
  "05. price"?: string
  "07. latest trading day"?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker)

export default function EnhancedOptionCalculator() {
  const [ticker, setTicker] = useState("")
  const [submittedTicker, setSubmittedTicker] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [autoPrice, setAutoPrice] = useState<number | null>(null)
  const [result, setResult] = useState<any>(null)
  
  // Add other state variables for option calculation inputs

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const shouldFetch = isValidTicker(submittedTicker)
  const { data, error, isLoading } = useSWR(shouldFetch ? `/api/stock?ticker=${submittedTicker}` : null, fetcher, {
    dedupingInterval: 60000,
  })

  useEffect(() => {
    setLoadingProgress(0)
    if (isLoading) {
      intervalRef.current = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          const newProgress = prevProgress + 5
          return newProgress > 90 ? 90 : newProgress
        })
      }, 100)
    } else {
      clearInterval(intervalRef.current!)
      setLoadingProgress(100)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLoading])

  useEffect(() => {
    if (!isLoading && data && data["05. price"]) {
      setLoadingProgress(100)
      setAutoPrice(Number.parseFloat(data["05. price"]))
    }
  }, [data, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedTicker(ticker)
  }

  const calculateOption = () => {
    // Implement your option calculation logic here using BlackScholes
    // Update the result state with the calculation output
    const calculationResult = BlackScholes(/* your parameters */)
    setResult({
      ...calculationResult,
      timestamp: new Date().getTime()
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter stock ticker"
        />
        <button type="submit">Submit</button>
      </form>

      {!shouldFetch && <p>Please enter a valid ticker symbol.</p>}
      {error && <p>Error fetching data for {submittedTicker}.</p>}

      {(isLoading || loadingProgress < 100) && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{ duration: 0.5 }}
        >
          <p>Fetching {submittedTicker} data... {loadingProgress}%</p>
        </motion.div>
      )}

      {data && data["05. price"] && (
        <div>
          <h2>{submittedTicker} Stock Price</h2>
          <p>${Number.parseFloat(data["05. price"]).toFixed(2)}</p>
          {data["07. latest trading day"] && (
            <p>Last updated: {data["07. latest trading day"]}</p>
          )}
        </div>
      )}

      {/* Add your option calculation inputs here */}
      <button onClick={calculateOption}>Calculate Option</button>

      {result && (
        <div>
          <h2>Option Calculation Result</h2>
          {/* Display your calculation results here */}
          <p>Last calculated at {new Date(result.timestamp).toLocaleString()}</p>
        </div>
      )}

      <p>Note: Due to Alpha Vantage's 25 request/day limit, stock data is only fetched when you submit a ticker.</p>
    </div>
  )
}