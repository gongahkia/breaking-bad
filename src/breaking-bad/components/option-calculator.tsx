// components/option-calculator.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { calculateOption } from "../app/actions/calculate";
import StockTicker from "./StockTicker";
import HeatMap from "./VolatilityHeatMap"; // Ensure this is the correct path to the modified file
import TradingRecommendations from "./TradingRecommendations";
import { CalculationResult, FormData, OptionInputs, OptionRecommendation, HeatMapData } from "./types"; // Import HeatMapData

export default function OptionCalculator() {
  const [volatilityPercent, setVolatilityPercent] = useState(16);
  const [interestRatePercent, setInterestRatePercent] = useState(5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [priceMode, setPriceMode] = useState<"auto" | "manual">("manual");
  const [tickerInput, setTickerInput] = useState("AAPL");
  const [submittedTicker, setSubmittedTicker] = useState("");
  const [autoPrice, setAutoPrice] = useState<number | null>(null);
  const [manualPrice, setManualPrice] = useState("100");
  const [formData, setFormData] = useState<FormData>({
    strikePrice: "100",
    dividendYield: "0",
    timeToExpiration: "1",
  });

  // Heatmap related states (moved from HeatMap.tsx)
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]); // To store the generated heat map data
  const [isGeneratingHeatMap, setIsGeneratingHeatMap] = useState(false); // To track heat map generation
  const [heatMapError, setHeatMapError] = useState<string | null>(null); // For heatmap specific errors

  const [recommendations, setRecommendations] = useState<OptionRecommendation[] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      strikePrice: '100',
      dividendYield: '0',
      timeToExpiration: '1',
    },
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFormDataChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateInputs = useCallback((): string | null => {
    const currentStockPrice = priceMode === "auto" ? autoPrice : Number(manualPrice);

    const strikePrice = Number(formData.strikePrice);
    const timeToExpiration = Number(formData.timeToExpiration);
    const dividendYield = Number(formData.dividendYield);
    const currentVolatilityPercent = volatilityPercent;
    const currentInterestRatePercent = interestRatePercent;

    if (!currentStockPrice || currentStockPrice <= 0 || isNaN(currentStockPrice)) return "Stock price must be a positive number.";
    if (!strikePrice || strikePrice <= 0 || isNaN(strikePrice)) return "Strike price must be a positive number.";
    if (!timeToExpiration || timeToExpiration <= 0 || isNaN(timeToExpiration)) return "Time to expiration must be a positive number.";
    if (dividendYield < 0 || isNaN(dividendYield)) return "Dividend yield cannot be negative.";
    if (currentVolatilityPercent <= 0 || isNaN(currentVolatilityPercent)) return "Volatility must be a positive number.";
    if (currentInterestRatePercent < 0 || isNaN(currentInterestRatePercent)) return "Risk-free rate cannot be negative.";
    return null;
  }, [priceMode, autoPrice, manualPrice, formData, volatilityPercent, interestRatePercent]);


  async function handleCalculate() {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setResult(null);
      setHeatMapData([]); // Clear heat map data if validation fails
      setRecommendations(null); // Clear recommendations if validation fails
      return;
    }
    setIsCalculating(true);
    setError(null);
    setResult(null); // Clear previous results before new calculation
    setHeatMapData([]); // Clear heat map data on new calculation
    setRecommendations(null); // Clear previous recommendations on new calculation

    try {
      const stockPrice = priceMode === "auto" ? (autoPrice || 0) : Number(manualPrice);
      const strikePrice = Number(formData.strikePrice);
      const interestRate = interestRatePercent / 100;
      const dividendYield = Number(formData.dividendYield);
      const timeToExpiration = Number(formData.timeToExpiration);
      const volatility = volatilityPercent / 100;

      const inputs: OptionInputs = { stockPrice, strikePrice, interestRate, dividendYield, timeToExpiration, volatility };

      console.log("Inputs being sent to calculateOption:", inputs);

      const calculationResult = await calculateOption(inputs);
      setResult(calculationResult);
    } catch (err) {
      console.error("Calculation failed:", err);
      setError("Failed to calculate option prices. Please check your inputs and try again.");
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }

  // Effect to manage mode changes
  useEffect(() => {
    if (priceMode === "manual") {
      setSubmittedTicker("");
      setAutoPrice(null);
      setStockData(null);
    }
    setResult(null);
    setHeatMapData([]); // Clear heat map data when mode changes
    setRecommendations(null);
    setError(null);
    setHeatMapError(null); // Clear heatmap specific error
  }, [priceMode]);

  const handleTickerSubmit = () => {
    if (tickerInput.trim()) {
      setSubmittedTicker(tickerInput.trim());
      setAutoPrice(null);
      setStockData(null);
      setError(null);
    }
  };

  const canCalculate = priceMode === "manual"
    ? !isNaN(Number(manualPrice)) && Number(manualPrice) > 0
    : autoPrice !== null && autoPrice > 0 && submittedTicker !== "";

  const getOptionInputs = useCallback((): OptionInputs => {
    const stockPrice = priceMode === "auto" ? (autoPrice || 0) : Number(manualPrice);
    return {
      stockPrice,
      strikePrice: Number(formData.strikePrice),
      interestRate: interestRatePercent / 100,
      dividendYield: Number(formData.dividendYield),
      timeToExpiration: Number(formData.timeToExpiration),
      volatility: volatilityPercent / 100, // This will be overwritten during heatmap generation
    };
  }, [priceMode, autoPrice, manualPrice, formData, interestRatePercent, volatilityPercent]);

  // NEW: Heat map generation logic (moved from VolatilityHeatMap.tsx)
  const generateHeatMap = async () => {
    const validationError = validateInputs(); // Validate all core inputs first
    if (validationError) {
      setHeatMapError(validationError); // Set error specific to heatmap generation
      setHeatMapData([]); // Clear old heatmap data
      return;
    }

    setIsGeneratingHeatMap(true);
    setHeatMapError(null); // Clear previous errors

    try {
      const heatMapResults: HeatMapData[] = [];
      const baseInputs = getOptionInputs(); // Get current valid inputs

      // Generate data for volatility range 5% to 50%
      for (let vol = 5; vol <= 50; vol += 2.5) {
        const inputs = {
          ...baseInputs,
          volatility: vol / 100, // Override volatility for each iteration
        };

        const calculationResult = await calculateOption(inputs);

        // Ensure numbers are parsed safely and handle potential nulls from calculationResult
        const callPrice = typeof calculationResult.callOptionPrice === 'number' ? calculationResult.callOptionPrice : NaN;
        const putPrice = typeof calculationResult.putOptionPrice === 'number' ? calculationResult.putOptionPrice : NaN;
        const delta = typeof calculationResult.delta === 'number' ? calculationResult.delta : NaN;


        // Only push if prices are valid numbers, otherwise this point in heatmap might be invalid
        if (!isNaN(callPrice) && !isNaN(putPrice) && !isNaN(delta)) {
          heatMapResults.push({
            volatility: vol,
            callPrice: callPrice,
            putPrice: putPrice,
            delta: delta,
          });
        } else {
             // Optionally, log an error or handle cases where a specific calculation fails
            console.warn(`Skipping heatmap point for volatility ${vol}% due to invalid calculation results.`);
        }
      }

      setHeatMapData(heatMapResults);
    } catch (err) {
      console.error("Failed to generate heat map:", err);
      setHeatMapError("Failed to generate heat map. Please check your inputs and try again.");
      setHeatMapData([]); // Clear data on error
    } finally {
      setIsGeneratingHeatMap(false);
    }
  };


  useEffect(() => {
    if ((result && resultsRef.current) || (heatMapData.length > 0 && resultsRef.current) || (recommendations && recommendations.length > 0 && resultsRef.current)) {
      resultsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [result, heatMapData, recommendations]); // Listen to heatmapData and recommendations too

  const handlePriceUpdate = useCallback((price: number) => {
    setAutoPrice(price);
  }, []);

  const handleDataUpdate = useCallback((data: { ticker: string; price: number; lastUpdate: string }) => {
    setStockData(data);
  }, []);

  const handleRecommendationsGenerated = useCallback((generatedRecs: OptionRecommendation[]) => {
    setRecommendations(generatedRecs);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 text-gray-800">
      {/* Left Card - Input Form */}
      <div className="lg:w-1/2 p-6 space-y-6 bg-white shadow-lg rounded-lg m-4">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-8">
          {[
            { label: "Current Stock Price", value: "auto" },
            { label: "Manual Stock Price", value: "manual" }
          ].map(opt => (
            <label key={opt.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="priceMode"
                value={opt.value}
                checked={priceMode === opt.value}
                onChange={() => setPriceMode(opt.value as "auto" | "manual")}
                className="sr-only"
              />
              <span className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 mr-3
                ${priceMode === opt.value
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 bg-white group-hover:border-blue-300"
                }
              `}>
                {priceMode === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-white block"></span>
                )}
              </span>
              <span className="text-gray-800 font-medium text-sm select-none">
                {opt.label}
              </span>
            </label>
          ))}
        </div>

        {/* Price Input */}
        <div className="bg-gray-50 rounded-xl p-4">
          {priceMode === "auto" ? (
            <>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Ticker Symbol
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., AAPL"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength={10}
                />
                <button
                  onClick={handleTickerSubmit}
                  disabled={!tickerInput.trim()}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium disabled:opacity-50 hover:bg-blue-600"
                >
                  Get
                </button>
              </div>
              {autoPrice !== null && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Current Stock Price (S₀)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200"
                    value={`${autoPrice.toFixed(2)}`}
                    disabled
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Stock Price (S₀)
              </label>
              <input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter stock price"
              />
            </>
          )}
        </div>

        {/* Option Parameters Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Strike Price (K)
            </label>
            <input
              type="number"
              value={formData.strikePrice}
              onChange={(e) => handleFormDataChange("strikePrice", e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Risk-free Rate (%)
            </label>
            <input
              type="number"
              value={interestRatePercent}
              onChange={(e) => setInterestRatePercent(Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Dividend Yield (%)
            </label>
            <input
              type="number"
              value={formData.dividendYield}
              onChange={(e) => handleFormDataChange("dividendYield", e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Time to Expiration (years)
            </label>
            <input
              type="number"
              value={formData.timeToExpiration}
              onChange={(e) => handleFormDataChange("timeToExpiration", e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Volatility (%)
            </label>
            <input
              type="number"
              value={volatilityPercent}
              onChange={(e) => setVolatilityPercent(Number(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCalculate}
            disabled={isCalculating || !canCalculate || validateInputs() !== null}
            className={`
              px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200
              ${canCalculate && !isCalculating && validateInputs() === null
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isCalculating ? "Calculating..." : "Calculate Options"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Generate Heat Map Button (Moved from HeatMap.tsx) */}
        <section className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Volatility Heat Map Generation</h4>
            <p className="text-sm text-gray-600">
                Generate a sensitivity analysis showing option prices across a range of volatilities.
            </p>
            <motion.button
                whileHover={{ scale: (canCalculate && validateInputs() === null) ? 1.02 : 1 }}
                whileTap={{ scale: (canCalculate && validateInputs() === null) ? 0.98 : 1 }}
                onClick={generateHeatMap}
                disabled={isGeneratingHeatMap || !canCalculate || validateInputs() !== null}
                className={`
                    w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg
                    ${(canCalculate && validateInputs() === null)
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                `}
            >
                {isGeneratingHeatMap ? (
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Generating Heat Map...
                    </div>
                ) : (
                    "Generate Volatility Heat Map"
                )}
            </motion.button>
            {heatMapError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 mt-2">
                <p className="text-sm text-red-800">{heatMapError}</p>
              </div>
            )}
        </section>


        {/* Trading Recommendations Component - Stays on the left for inputs */}
        <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Trading Recommendations Input</h2>
            <p className="text-sm text-gray-600">
                Enter current market prices to get buy/sell recommendations based on theoretical values.
            </p>
            <TradingRecommendations
                result={result}
                onGenerateRecommendations={handleRecommendationsGenerated}
            />
        </section>

      </div>

      {/* Right Panel - Results Card */}
      <div
        ref={resultsRef}
        className="lg:w-1/2 p-6 space-y-6 bg-white shadow-lg rounded-lg m-4 overflow-y-auto flex-shrink-0"
      >
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Results</h3>

          {/* Stock Ticker (Hidden) - Only for data fetching when in auto mode */}
          {priceMode === "auto" && submittedTicker && (
            <div style={{ display: 'none' }}>
              <StockTicker
                ticker={submittedTicker}
                onPriceUpdate={handlePriceUpdate}
                onDataUpdate={handleDataUpdate}
              />
            </div>
          )}

          {/* Stock Data Display */}
          {stockData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <h4 className="font-semibold text-gray-800 mb-2">Stock Information</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Ticker:</span> {stockData.ticker}</p>
                <p><span className="font-medium">Price:</span> ${stockData.price.toFixed(2)}</p>
                <p><span className="font-medium">Updated:</span> {stockData.lastUpdate}</p>
              </div>
            </motion.div>
          )}

          {/* Pricing Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-3"
            >
              <h4 className="font-semibold text-gray-800">Option Pricing</h4>
              {[
                { label: "Call Option Price", value: result.callOptionPrice, color: "text-green-600" },
                { label: "Put Option Price", value: result.putOptionPrice, color: "text-red-600" },
                { label: "Implied Volatility", value: result.impliedVolatility, color: "text-blue-600" },
                { label: "Delta", value: result.delta, color: "text-purple-600" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-white border border-gray-200 flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700 font-medium">{label}</span>
                  <span className={`font-bold ${color}`}>
                    {typeof value === 'number' && value !== null ? value.toFixed(4) : 'N/A'}
                    {label === "Implied Volatility" && typeof value === 'number' && value !== null ? '%' : ''}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Heat Map Results (Display only, receives data) */}
          {heatMapData.length > 0 && ( // Only render if data exists
            <HeatMap
              heatMapData={heatMapData} // Pass the generated data
            />
          )}

          {/* Trading Recommendations & Analysis Section */}
          {recommendations && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-4"
            >
              <h4 className="font-semibold text-gray-800 mb-2">Trading Recommendations & Analysis</h4>
              {recommendations.map((rec, index) => (
                <div key={index} className="border p-3 rounded-md shadow-sm bg-gray-50">
                  <p>
                    <strong>{rec.type === 'call' ? 'Call Option' : 'Put Option'} {rec.action.toUpperCase()}</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      rec.confidence === 'high' ? 'bg-green-200 text-green-800' :
                      rec.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {rec.confidence.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm mt-1">{rec.reason}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Theoretical Price: ${rec.theoreticalPrice.toFixed(2)} | Market Price: ${rec.marketPrice.toFixed(2)} | Difference: ${rec.priceDifference.toFixed(2)}
                  </p>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-4">
                <strong className="text-red-600">Disclaimer:</strong> These recommendations are based on theoretical Black-Scholes pricing and should not be considered as financial advice. Always conduct your own research and consider market conditions, liquidity, and risk tolerance before trading.
              </p>
            </motion.div>
          )}

          {/* Empty State */}
          {!result && !stockData && heatMapData.length === 0 && !recommendations && (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-sm">Calculate options or fetch stock data to see results here</p>
                <p className="text-xs mt-2">← Input parameters on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}