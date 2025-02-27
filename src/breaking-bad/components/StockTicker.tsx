"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

interface StockData {
  "01. symbol"?: string;
  "05. price"?: string;
  "07. latest trading day"?: string;
}

interface StockTickerProps {
  ticker: string;
  onPriceUpdate?: (price: number) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker);

export default function StockTicker({ ticker, onPriceUpdate }: StockTickerProps) {
  const shouldFetch = isValidTicker(ticker);
  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/api/stock?ticker=${ticker}` : null,
    fetcher,
    { dedupingInterval: 60000 }
  );

  // State for loading bar progress
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          return newProgress > 90 ? 90 : newProgress; // Cap at 90%
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100); // Set to 100% when loading is done
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && data && data["05. price"]) {
      setLoadingProgress(100); // Ensure it's 100% when data is loaded
    }
  }, [data, isLoading]);

  if (!shouldFetch) {
    return <div className="text-red-500">Please enter a valid ticker symbol.</div>;
  }

  if (error) {
    return <div className="text-red-500">Error fetching data for {ticker}.</div>;
  }

  return (
    <div>
      {/* Loading Bar */}
      {isLoading && (
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${loadingProgress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            />
          </div>
        </div>
      )}

      {data && data["05. price"] ? (
        <div className="mt-2">
          <div className="text-lg font-semibold">{ticker} Stock Price</div>
          <div className="text-2xl">${parseFloat(data["05. price"]).toFixed(2)}</div>
          {data["07. latest trading day"] && (
            <div className="text-sm text-gray-500">Last updated: {data["07. latest trading day"]}</div>
          )}
          {/* Notify the parent component with the auto-fetched price when it changes */}
          {useEffect(() => {
          if (onPriceUpdate) {
            onPriceUpdate(parseFloat(data["05. price"]));
            }
            }, [data, onPriceUpdate])}
        </div>
      ) : (
        isLoading ? null : <div className="text-gray-500">Price data is unavailable.</div>
      )}
    </div>
  );
}