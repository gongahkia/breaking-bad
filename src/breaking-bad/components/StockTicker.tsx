"use client"

import { useEffect, useState, useRef, useCallback } from "react" // Added useCallback
import useSWR from "swr"

interface StockData {
  "01. symbol"?: string;
  "05. price"?: string;
  "07. latest trading day"?: string;
}

interface StockTickerProps {
  ticker: string;
  onPriceUpdate?: (price: number) => void;
  onDataUpdate?: (data: { ticker: string; price: number; lastUpdate: string }) => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker);

export default function StockTicker({ ticker, onPriceUpdate, onDataUpdate }: StockTickerProps) {
  const shouldFetch = isValidTicker(ticker);
  const { data, error, isLoading } = useSWR(shouldFetch ? `/api/stock?ticker=${ticker}` : null, fetcher, {
    dedupingInterval: 60000,
  });

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoize the data processing to prevent unnecessary re-renders
  const processStockData = useCallback(() => {
    if (!isMounted.current) {
      return;
    }

    if (error) {
      onDataUpdate?.({ ticker: ticker, price: 0, lastUpdate: "Error fetching data" });
      onPriceUpdate?.(0);
    } else if (!isLoading && data && data["05. price"]) {
      const price = Number.parseFloat(data["05. price"]);
      if (!isNaN(price)) {
        onPriceUpdate?.(price);

        onDataUpdate?.({
          ticker: data["01. symbol"] || ticker,
          price,
          lastUpdate: data["07. latest trading day"] || new Date().toLocaleString()
        });
      }
    }
  }, [data, error, isLoading, onPriceUpdate, onDataUpdate, ticker]); // Dependencies

  useEffect(() => {
    processStockData();
  }, [processStockData]); // Only re-run if processStockData changes (which it shouldn't)

  return null;
}