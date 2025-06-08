// components/VolatilityHeatMap.tsx (formerly HeatMap.tsx)
"use client";

import { motion } from "framer-motion";
import { HeatMapData, OptionInputs } from "./types"; // OptionInputs might not be directly used here anymore for rendering

interface HeatMapProps {
  heatMapData: HeatMapData[]; // Now receives data directly
  // Removed canGenerate, as generation logic moves to parent
  // Removed displayOnly, as this component is now always for display
}

export default function HeatMap({ heatMapData }: HeatMapProps) {
  // Color scale for heat map - keeping the same logic, it's pretty good!
  const getHeatMapColor = (value: number, min: number, max: number) => {
    if (min === max) return `hsl(0, 0%, 90%)`; // Handle flat data to avoid division by zero
    const normalized = (value - min) / (max - min);
    // Using a more vibrant and distinct color range, e.g., yellow to red
    // For call/put prices, higher is often 'more expensive' so red is good for high values.
    // HSL: Hue (0-360), Saturation (0-100%), Lightness (0-100%)
    // Let's go from a cool blue/green for low to warm red for high
    const hue = (1 - normalized) * 120; // 120 (green) to 0 (red)
    return `hsl(${hue}, 80%, 45%)`;
  };

  // Delta color scale (can be different, e.g., diverging for positive/negative delta)
  const getDeltaColor = (delta: number, maxAbsDelta: number) => {
    if (maxAbsDelta === 0) return `hsl(0, 0%, 90%)`;

    // Normalize delta from -maxAbsDelta to +maxAbsDelta to a 0-1 range
    const normalized = (delta + maxAbsDelta) / (2 * maxAbsDelta);

    // Using a diverging color scale: blue for negative, green for neutral, red for positive
    // You can adjust these hues.
    // Example: Blue (240) -> White/Gray (~60-90) -> Red (0)
    let hue;
    if (delta < 0) {
      hue = 240 - (normalized * 120); // Blue towards more neutral
    } else {
      hue = (1 - normalized) * 120; // Neutral towards red
    }
    // Clamp hue to valid range [0, 240] for safe HSL
    hue = Math.max(0, Math.min(240, hue));

    return `hsl(${hue}, 70%, 50%)`;
  };


  if (!heatMapData || heatMapData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No heat map data available. Generate it using the button on the left.</p>
      </div>
    );
  }

  // Calculate min/max for color scaling
  const maxCallPrice = Math.max(...heatMapData.map(d => d.callPrice));
  const minCallPrice = Math.min(...heatMapData.map(d => d.callPrice));
  const maxPutPrice = Math.max(...heatMapData.map(d => d.putPrice));
  const minPutPrice = Math.min(...heatMapData.map(d => d.putPrice));
  const maxAbsDelta = Math.max(...heatMapData.map(d => Math.abs(d.delta)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Volatility Sensitivity Heat Map</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Call Options Heat Map Table */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">Call Option Prices ($)</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-gray-700 p-2 border-b border-gray-200">
              <div className="text-center">Volatility</div>
              <div className="text-center">Price</div>
              <div className="text-center">Delta</div>
            </div>
            {heatMapData.map((data, index) => (
              <div key={index} className="grid grid-cols-3 text-sm p-2 border-b border-gray-100 last:border-b-0">
                <div className="text-center text-gray-600 font-medium">{data.volatility}%</div>
                <div
                  className="p-1 text-center font-bold rounded-sm mx-1"
                  style={{ backgroundColor: getHeatMapColor(data.callPrice, minCallPrice, maxCallPrice) }}
                >
                  ${data.callPrice.toFixed(2)}
                </div>
                <div
                  className="p-1 text-center font-bold rounded-sm mx-1"
                  style={{ backgroundColor: getDeltaColor(data.delta, maxAbsDelta) }}
                >
                  {data.delta.toFixed(3)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-500 px-2">
            <span>Min Price: ${minCallPrice.toFixed(2)}</span>
            <span>Max Price: ${maxCallPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Put Options Heat Map Table */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">Put Option Prices ($)</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-gray-700 p-2 border-b border-gray-200">
              <div className="text-center">Volatility</div>
              <div className="text-center">Price</div>
              <div className="text-center">Delta</div>
            </div>
            {heatMapData.map((data, index) => (
              <div key={index} className="grid grid-cols-3 text-sm p-2 border-b border-gray-100 last:border-b-0">
                <div className="text-center text-gray-600 font-medium">{data.volatility}%</div>
                <div
                  className="p-1 text-center font-bold rounded-sm mx-1"
                  style={{ backgroundColor: getHeatMapColor(data.putPrice, minPutPrice, maxPutPrice) }}
                >
                  ${data.putPrice.toFixed(2)}
                </div>
                <div
                  className="p-1 text-center font-bold rounded-sm mx-1"
                  style={{ backgroundColor: getDeltaColor(data.delta, maxAbsDelta) }}
                >
                  {data.delta.toFixed(3)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-500 px-2">
            <span>Min Price: ${minPutPrice.toFixed(2)}</span>
            <span>Max Price: ${maxPutPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>This heat map illustrates how theoretical option prices and delta sensitivity change across a range of volatilities.</p>
        <p>Colors indicate relative value: warmer colors for higher prices/more extreme delta, cooler for lower/more neutral.</p>
      </div>
    </motion.div>
  );
}