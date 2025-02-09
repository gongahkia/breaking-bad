// components/StockTicker.tsx
"use client";

import useSWR from "swr";
import { motion } from "framer-motion";

interface StockData {
  ticker: string;
  price: number;
  // Add other fields as needed
}

interface StockTickerProps {
  ticker: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Note: Ensure you have an API route at /api/stock (or update the URL) that returns live stock data for the given ticker.
export default function StockTicker({ ticker }: StockTickerProps) {
  const { data, error } = useSWR<StockData>(
    `/api/stock?ticker=${ticker}`,
    fetcher,
    { refreshInterval: 5000 } // refresh every 5 seconds for live updates
  );

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white rounded-lg shadow border border-gray-200"
    >
      <h3 className="text-lg font-bold mb-2">{ticker} Stock Price</h3>
      <p className="text-2xl text-indigo-600">
        ${data.price.toFixed(2)}
      </p>
      {/* You can add additional stock details here */}
    </motion.div>
  );
}
