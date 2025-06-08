"use client"

import { useEffect, useState, useRef } from "react"
import useSWR from "swr"
// Removed motion import as it's no longer needed for rendering this component visually
// import { motion } from "framer-motion"

interface StockData {
  "01. symbol"?: string
  "05. price"?: string
  "07. latest trading day"?: string
}

interface StockTickerProps {
  ticker: string
  onPriceUpdate?: (price: number) => void
  onDataUpdate?: (data: { ticker: string; price: number; lastUpdate: string }) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const isValidTicker = (ticker: string) => /^[A-Z]{1,5}$/.test(ticker)

export default function StockTicker({ ticker, onPriceUpdate, onDataUpdate }: StockTickerProps) {
  const shouldFetch = isValidTicker(ticker)
  const { data, error, isLoading } = useSWR(shouldFetch ? `/api/stock?ticker=${ticker}` : null, fetcher, {
    dedupingInterval: 60000,
  })

  // 1. Create a ref to track if the component is mounted
  const isMounted = useRef(false);

  useEffect(() => {
    // 2. Set isMounted to true when the component mounts
    isMounted.current = true;

    // 3. Set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array means this runs once on mount and once on unmount

  useEffect(() => {
    // Check if the component is still mounted before attempting state updates
    if (!isMounted.current) {
        return; // Component has unmounted, do not proceed with state updates
    }

    if (error) {
      onDataUpdate?.({ ticker: ticker, price: 0, lastUpdate: "Error fetching data" });
      onPriceUpdate?.(0);
    } else if (!isLoading && data && data["05. price"]) {
      const price = Number.parseFloat(data["05. price"])
      if (!isNaN(price)) {
        onPriceUpdate?.(price)
        
        onDataUpdate?.({
          ticker: data["01. symbol"] || ticker,
          price,
          lastUpdate: data["07. latest trading day"] || new Date().toLocaleString()
        })
      }
    }
  }, [data, error, isLoading, onPriceUpdate, onDataUpdate, ticker, isMounted]); // Add isMounted to dependencies

  // This component returns null, as it's a headless component for data fetching.
  return null
}