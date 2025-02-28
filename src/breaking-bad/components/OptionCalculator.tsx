"use client"

import { useState, useEffect, useRef } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"

interface StockData {
  "01. symbol"?: string
  "05. price"?: string
  "07. latest trading day"?: string
}

interface OptionInputs {
  stockPrice: number
  strikePrice: number
  timeToExpiration: number
  interestRate: number
  volatility: number
  optionType: "call" | "put"
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker)

export default function EnhancedOptionCalculator() {
  const [ticker, setTicker] = useState("")
  const [submittedTicker, setSubmittedTicker] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [autoPrice, setAutoPrice] = useState<number | null>(null)
  const [result, setResult] = useState<any>(null)
  const [inputs, setInputs] = useState<OptionInputs>({
    stockPrice: 0,
    strikePrice: 0,
    timeToExpiration: 0,
    interestRate: 0,
    volatility: 0,
    optionType: "call"
  })

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
      const price = Number.parseFloat(data["05. price"])
      setAutoPrice(price)
      setInputs(prev => ({ ...prev, stockPrice: price }))
    }
  }, [data, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedTicker(ticker)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) }))
  }

  const handleOptionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputs(prev => ({ ...prev, optionType: e.target.value as "call" | "put" }))
  }

  const calculateOption = () => {
    const { stockPrice, strikePrice, timeToExpiration, interestRate, volatility, optionType } = inputs
    
    const d1 = (Math.log(stockPrice / strikePrice) + (interestRate + volatility ** 2 / 2) * timeToExpiration) / (volatility * Math.sqrt(timeToExpiration))
    const d2 = d1 - volatility * Math.sqrt(timeToExpiration)
    
    const normalCDF = (x: number) => {
      const t = 1 / (1 + 0.2316419 * Math.abs(x))
      const d = 0.3989423 * Math.exp(-x * x / 2)
      const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
      return x > 0 ? 1 - probability : probability
    }

    let optionPrice: number
    if (optionType === "call") {
      optionPrice = stockPrice * normalCDF(d1) - strikePrice * Math.exp(-interestRate * timeToExpiration) * normalCDF(d2)
    } else {
      optionPrice = strikePrice * Math.exp(-interestRate * timeToExpiration) * normalCDF(-d2) - stockPrice * normalCDF(-d1)
    }

    setResult({
      optionPrice,
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

      <div>
        <h2>Option Calculator</h2>
        Stock Price: <input name="stockPrice" type="number" value={inputs.stockPrice} onChange={handleInputChange} placeholder="Stock Price" />
        <br></br>
        Strike Price: <input name="strikePrice" type="number" value={inputs.strikePrice} onChange={handleInputChange} placeholder="Strike Price" />
        <br></br>
        Time to expiration: <input name="timeToExpiration" type="number" value={inputs.timeToExpiration} onChange={handleInputChange} placeholder="Time to Expiration (years)" />
        <br></br>
        Interest rate: <input name="interestRate" type="number" value={inputs.interestRate} onChange={handleInputChange} placeholder="Interest Rate (decimal)" />
        <br></br>
        Volatility: <input name="volatility" type="number" value={inputs.volatility} onChange={handleInputChange} placeholder="Volatility (decimal)" />
        <br></br>
        Option type: <select name="optionType" value={inputs.optionType} onChange={handleOptionTypeChange}>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
        <br></br>
        <button onClick={calculateOption}>Calculate</button>
        <br></br>
      </div>

      {result && (
        <div>
          <h2>Option Calculation Result</h2>
          <p>Option Price: ${result.optionPrice.toFixed(2)}</p>
          <p>Last calculated at {new Date(result.timestamp).toLocaleString()}</p>
        </div>
      )}

      <p>Note: Due to Alpha Vantage's 25 request/day limit, stock data is only fetched when you submit a ticker.</p>
    </div>
  )
}