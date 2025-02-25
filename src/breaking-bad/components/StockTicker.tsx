"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

interface StockData {
  // Alpha Vantage's Global Quote returns keys like these:
  "01. symbol"?: string;
  "05. price"?: string;
  "07. latest trading day"?: string;
  // add other fields if needed
}

interface StockTickerProps {
  ticker: string;
  onPriceUpdate?: (price: number) => void;
}

// A simple fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Validate ticker symbols (assumes valid tickers are 1-5 uppercase letters)
const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker);

export default function StockTicker({ ticker }: StockTickerProps) {
  // Only fetch if the ticker is valid
  const shouldFetch = isValidTicker(ticker);

  // Using SWR without an automatic refresh; dedupingInterval caches repeated requests
  const { data, error, isLoading } = useSWR<StockData>(
    shouldFetch ? `/api/stock?ticker=${ticker}` : null,
    fetcher,
    { dedupingInterval: 60000 } // cache responses for 60 seconds
  );

  if (!shouldFetch) {
    return (
      <div className="text-gray-600">
        Please enter a valid ticker symbol.
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
  if (isLoading) {
    return (
      <div className="text-gray-600">
        Loading {ticker} stock data...
      </div>
    );
  }

  // Extract the price from the API response using Alpha Vantage's key
  const priceValue = data["05. price"];
  if (!priceValue) {
    return (
      <div className="text-red-500">
        Price data is unavailable.
      </div>
    );
  }

  const price = parseFloat(priceValue);
  const lastUpdated = data["07. latest trading day"];

  // Notify the parent component with the auto-fetched price when it changes
  useEffect(() => {
    if (onPriceUpdate) {
      onPriceUpdate(price);
    }
  }, [price, onPriceUpdate]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white rounded-lg shadow border border-gray-200"
    >
      <h3 className="text-lg font-bold mb-2">{ticker} Stock Price</h3>
      <p className="text-2xl text-indigo-600">${price.toFixed(2)}</p>
      {lastUpdated && (
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
      )}
    </motion.div>
  );
}