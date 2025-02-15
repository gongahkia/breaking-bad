"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StockData {
  symbol: string;
  price: number;
  lastUpdated: string;
}

interface StockTickerProps {
  ticker: string;
}

export default function StockTicker({ ticker }: StockTickerProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`/api/stock?ticker=${ticker}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setStockData({
            symbol: data["01. symbol"],
            price: parseFloat(data["05. price"]),
            lastUpdated: data["07. latest trading day"],
          });
          setError(null);
        }
      } catch (err) {
        setError("Error fetching stock data");
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [ticker]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!stockData) {
    return <div className="text-gray-600">Loading {ticker} stock data...</div>;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white rounded-lg shadow border border-gray-200"
    >
      <h3 className="text-lg font-bold mb-2">{stockData.symbol} Stock Price</h3>
      <p className="text-2xl text-indigo-600">${stockData.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500">
        Last updated: {stockData.lastUpdated}
      </p>
    </motion.div>
  );
}