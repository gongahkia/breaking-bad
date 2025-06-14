// components/TradingRecommendations.tsx
"use client";

import { useState } from 'react';
import { CalculationResult, OptionRecommendation } from './types';
import { generateRecommendations } from '../app/actions/recommendations';

interface TradingRecommendationsProps {
  result: CalculationResult | null;
  onGenerateRecommendations: (recommendations: OptionRecommendation[]) => void;
}

export default function TradingRecommendations({ result, onGenerateRecommendations }: TradingRecommendationsProps) {
  const [marketCallPrice, setMarketCallPrice] = useState<string>('');
  const [marketPutPrice, setMarketPutPrice] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  // You no longer need recommendations state here as it's lifted to the parent
  // const [recommendations, setRecommendations] = useState<OptionRecommendation[]>([]);

  const handleGenerateRecommendations = async () => {
    setRecommendationError(null);
    // setRecommendations([]); // Clear previous recommendations (optional, parent handles this now)
    setIsGenerating(true);

    if (!result || result.callOptionPrice === null || result.putOptionPrice === null) {
      setRecommendationError("Please calculate option prices first.");
      setIsGenerating(false);
      return;
    }

    const marketCall = parseFloat(marketCallPrice);
    const marketPut = parseFloat(marketPutPrice);

    if (isNaN(marketCall) || marketCall <= 0 || isNaN(marketPut) || marketPut <= 0) {
      setRecommendationError("Please enter valid positive market prices.");
      setIsGenerating(false);
      return;
    }

    try {
      const recs = await generateRecommendations(
        result.callOptionPrice,
        marketCall,
        result.putOptionPrice,
        marketPut
      );
      // Call the prop function to send recommendations to the parent
      onGenerateRecommendations(recs);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendationError("Failed to generate recommendations. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate =
    result !== null &&
    result.callOptionPrice !== null &&
    result.putOptionPrice !== null &&
    parseFloat(marketCallPrice) > 0 &&
    parseFloat(marketPutPrice) > 0 &&
    !isNaN(parseFloat(marketCallPrice)) &&
    !isNaN(parseFloat(marketPutPrice)) &&
    !isGenerating;


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="marketCallPrice" className="block text-sm font-medium text-gray-700">
            Market Call Option Price
          </label>
          <input
            type="number"
            id="marketCallPrice"
            value={marketCallPrice}
            onChange={(e) => setMarketCallPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter market call price"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="marketPutPrice" className="block text-sm font-medium text-gray-700">
            Market Put Option Price
          </label>
          <input
            type="number"
            id="marketPutPrice"
            value={marketPutPrice}
            onChange={(e) => setMarketPutPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter market put price"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <button
        onClick={handleGenerateRecommendations}
        disabled={!canGenerate || isGenerating}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          !canGenerate || isGenerating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Recommendations'}
      </button>

      {recommendationError && (
        <p className="text-red-500 text-sm mt-2">{recommendationError}</p>
      )}

    </div>
  );
}