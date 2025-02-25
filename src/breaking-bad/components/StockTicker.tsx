"use client";

import useSWR from "swr";
import { motion } from "framer-motion";

interface StockData {
  // Alpha Vantage's Global Quote returns keys like these:
  "01. symbol"?: string;
  "05. price"?: string;
  // ...other fields if needed
}

interface StockTickerProps {
  ticker: string;
}

// A simple fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Simple ticker validation (adjust as needed)
const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker);

export default function StockTicker({ ticker }: StockTickerProps) {
  const shouldFetch = isValidTicker(ticker);

  const { data, error } = useSWR<StockData>(
    shouldFetch ? `/api/stock?ticker=${ticker}` : null,
    fetcher,
    { refreshInterval: shouldFetch ? 10000 : 0 }
  );

  if (!shouldFetch) {
    return (
      <div className="text-gray-600">
        Please enter a valid ticker symbol to load data.
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500">
        Error fetching data for {ticker}.
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-gray-600">
        Loading {ticker} stock data...
      </div>
    );
  }

  // Extract the price from the "05. price" key
  const priceValue = data["05. price"];
  if (!priceValue) {
    return (
      <div className="text-red-500">
        Price data is unavailable.
      </div>
    );
  }

  const price = parseFloat(priceValue);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white rounded-lg shadow border border-gray-200"
    >
      <h3 className="text-lg font-bold mb-2">{ticker} Stock Price</h3>
      <p className="text-2xl text-indigo-600">${price.toFixed(2)}</p>
    </motion.div>
  );
}