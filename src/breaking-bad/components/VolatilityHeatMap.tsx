import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeatMapData } from '../app/components/types'; 

interface VolatilityHeatMapProps {
  heatMapData: HeatMapData[];
}

const VolatilityHeatMap: React.FC<VolatilityHeatMapProps> = ({ heatMapData }) => {
  const [activeMetric, setActiveMetric] = useState<'callPrice' | 'putPrice' | 'delta'>('callPrice');
  const [hoveredCell, setHoveredCell] = useState<HeatMapData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Calculate statistics for the current metric
  const statistics = useMemo(() => {
    if (!heatMapData.length) return null;

    const callPrices = heatMapData.map(d => d.callPrice);
    const putPrices = heatMapData.map(d => d.putPrice);
    const deltas = heatMapData.map(d => d.delta);

    return {
      callPrice: {
        min: Math.min(...callPrices),
        max: Math.max(...callPrices),
        avg: callPrices.reduce((a, b) => a + b, 0) / callPrices.length,
        values: callPrices
      },
      putPrice: {
        min: Math.min(...putPrices),
        max: Math.max(...putPrices),
        avg: putPrices.reduce((a, b) => a + b, 0) / putPrices.length,
        values: putPrices
      },
      delta: {
        min: Math.min(...deltas),
        max: Math.max(...deltas),
        avg: deltas.reduce((a, b) => a + b, 0) / deltas.length,
        values: deltas,
        maxAbs: Math.max(...deltas.map(d => Math.abs(d)))
      }
    };
  }, [heatMapData]);

  // Enhanced color functions matching your original logic but with better visual appeal
  const getIntensiveColor = (value: number, min: number, max: number, type: 'price' | 'delta' = 'price') => {
    if (min === max) return 'rgb(240, 240, 240)';
    
    const normalized = (value - min) / (max - min);
    
    if (type === 'delta' && statistics) {
      // Diverging color scale for delta (blue for negative, red for positive)
      const maxAbsDelta = statistics.delta.maxAbs;
      if (maxAbsDelta === 0) return 'rgb(240, 240, 240)';
      
      const normalizedDelta = (value + maxAbsDelta) / (2 * maxAbsDelta);
      
      if (value < 0) {
        const intensity = Math.abs(value) / maxAbsDelta;
        return `rgb(${Math.round(100 * (1 - intensity))}, ${Math.round(150 * (1 - intensity))}, ${Math.round(255)})`;
      } else {
        const intensity = value / maxAbsDelta;
        return `rgb(${Math.round(255)}, ${Math.round(100 * (1 - intensity))}, ${Math.round(100 * (1 - intensity))})`;
      }
    } else {
      // Sequential color scale for prices (cool to warm)
      const hue = (1 - normalized) * 120; // 120 (green) to 0 (red)
      return `hsl(${hue}, 80%, ${45 + normalized * 10}%)`;
    }
  };

  const currentStats = statistics?.[activeMetric];

  if (!heatMapData || heatMapData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg text-center"
      >
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Heat Map Data Available</h3>
        <p className="text-gray-500">Generate heat map data using the button in the input panel to see volatility sensitivity analysis.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">Volatility Sensitivity Heat Map</h3>
            <p className="text-purple-100 text-sm">Theoretical option pricing across volatility scenarios</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'bg-purple-500 text-white hover:bg-purple-400'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'table' 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'bg-purple-500 text-white hover:bg-purple-400'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { key: 'callPrice', label: 'Call Option Prices', icon: '📈', color: 'from-green-500 to-emerald-500' },
            { key: 'putPrice', label: 'Put Option Prices', icon: '📉', color: 'from-red-500 to-rose-500' },
            { key: 'delta', label: 'Delta Sensitivity', icon: 'Δ', color: 'from-blue-500 to-indigo-500' }
          ].map((metric) => (
            <motion.button
              key={metric.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveMetric(metric.key as typeof activeMetric)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg ${
                activeMetric === metric.key
                  ? `bg-gradient-to-r ${metric.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{metric.icon}</span>
              {metric.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Heat Map Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeMetric === 'callPrice' ? 'Call Option Prices ($)' : 
                   activeMetric === 'putPrice' ? 'Put Option Prices ($)' : 'Delta Sensitivity'}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Volatility Range: {heatMapData[0]?.volatility}% - {heatMapData[heatMapData.length - 1]?.volatility}%</span>
                  <span>•</span>
                  <span>{heatMapData.length} Data Points</span>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 rounded-xl">
                {heatMapData.map((data, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    onHoverStart={() => setHoveredCell(data)}
                    onHoverEnd={() => setHoveredCell(null)}
                    className="relative aspect-square rounded-lg cursor-pointer shadow-md transition-all duration-300 border-2 border-white"
                    style={{
                      backgroundColor: currentStats ? getIntensiveColor(
                        data[activeMetric], 
                        currentStats.min, 
                        currentStats.max,
                        activeMetric === 'delta' ? 'delta' : 'price'
                      ) : '#f0f0f0'
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white font-bold text-xs p-1">
                      <div className="text-[10px] opacity-90 mb-1">{data.volatility}%</div>
                      <div className="text-sm leading-tight text-center">
                        {activeMetric === 'delta' 
                          ? data[activeMetric].toFixed(3)
                          : `$${data[activeMetric].toFixed(2)}`
                        }
                      </div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Color Scale Legend */}
              {currentStats && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>
                      Min: {activeMetric === 'delta' 
                        ? currentStats.min.toFixed(3) 
                        : `$${currentStats.min.toFixed(2)}`
                      }
                    </span>
                    <span>
                      Avg: {activeMetric === 'delta' 
                        ? currentStats.avg.toFixed(3) 
                        : `$${currentStats.avg.toFixed(2)}`
                      }
                    </span>
                    <span>
                      Max: {activeMetric === 'delta' 
                        ? currentStats.max.toFixed(3) 
                        : `$${currentStats.max.toFixed(2)}`
                      }
                    </span>
                  </div>
                  <div className={`h-4 rounded-full ${
                    activeMetric === 'delta' 
                      ? 'bg-gradient-to-r from-blue-400 via-gray-200 to-red-400'
                      : 'bg-gradient-to-r from-green-300 via-yellow-400 to-red-500'
                  }`}></div>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="space-y-6">
              {/* Current Selection Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Live Data</h4>
                {hoveredCell ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-800">
                        {hoveredCell.volatility}%
                      </div>
                      <div className="text-sm text-gray-600">Volatility</div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-bold text-green-800 text-lg">
                          ${hoveredCell.callPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-green-600">Call Price</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="font-bold text-red-800 text-lg">
                          ${hoveredCell.putPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-red-600">Put Price</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="font-bold text-blue-800 text-lg">
                          {hoveredCell.delta.toFixed(3)}
                        </div>
                        <div className="text-xs text-blue-600">Delta</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-sm">Hover over a cell to see detailed information</p>
                  </div>
                )}
              </div>

              {/* Statistics Panel */}
              {currentStats && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Statistics</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Range:</span>
                      <span className="font-semibold">
                        {activeMetric === 'delta' 
                          ? `${(currentStats.max - currentStats.min).toFixed(3)}`
                          : `$${(currentStats.max - currentStats.min).toFixed(2)}`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Points:</span>
                      <span className="font-semibold">{heatMapData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vol. Step:</span>
                      <span className="font-semibold">
                        {heatMapData.length > 1 ? (heatMapData[1].volatility - heatMapData[0].volatility).toFixed(1) : 'N/A'}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Table View (Original format, enhanced)
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Call Options Table */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                📈 Call Option Prices ($)
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-gradient-to-r from-gray-100 to-gray-200 text-sm font-semibold text-gray-700 p-3 border-b border-gray-200">
                  <div className="text-center">Volatility</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Delta</div>
                </div>
                {heatMapData.map((data, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="grid grid-cols-3 text-sm p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center text-gray-600 font-medium">{data.volatility}%</div>
                    <div
                      className="p-2 text-center font-bold rounded-md mx-1 text-white shadow-sm"
                      style={{ 
                        backgroundColor: statistics ? getIntensiveColor(
                          data.callPrice, 
                          statistics.callPrice.min, 
                          statistics.callPrice.max, 
                          'price'
                        ) : '#f0f0f0'
                      }}
                    >
                      ${data.callPrice.toFixed(2)}
                    </div>
                    <div
                      className="p-2 text-center font-bold rounded-md mx-1 text-white shadow-sm"
                      style={{ 
                        backgroundColor: statistics ? getIntensiveColor(
                          data.delta, 
                          statistics.delta.min, 
                          statistics.delta.max, 
                          'delta'
                        ) : '#f0f0f0'
                      }}
                    >
                      {data.delta.toFixed(3)}
                    </div>
                  </motion.div>
                ))}
              </div>
              {statistics && (
                <div className="mt-3 flex justify-between text-xs text-gray-500 px-2">
                  <span>Min: ${statistics.callPrice.min.toFixed(2)}</span>
                  <span>Max: ${statistics.callPrice.max.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Put Options Table */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                📉 Put Option Prices ($)
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-gradient-to-r from-gray-100 to-gray-200 text-sm font-semibold text-gray-700 p-3 border-b border-gray-200">
                  <div className="text-center">Volatility</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Delta</div>
                </div>
                {heatMapData.map((data, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="grid grid-cols-3 text-sm p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center text-gray-600 font-medium">{data.volatility}%</div>
                    <div
                      className="p-2 text-center font-bold rounded-md mx-1 text-white shadow-sm"
                      style={{ 
                        backgroundColor: statistics ? getIntensiveColor(
                          data.putPrice, 
                          statistics.putPrice.min, 
                          statistics.putPrice.max, 
                          'price'
                        ) : '#f0f0f0'
                      }}
                    >
                      ${data.putPrice.toFixed(2)}
                    </div>
                    <div
                      className="p-2 text-center font-bold rounded-md mx-1 text-white shadow-sm"
                      style={{ 
                        backgroundColor: statistics ? getIntensiveColor(
                          data.delta, 
                          statistics.delta.min, 
                          statistics.delta.max, 
                          'delta'
                        ) : '#f0f0f0'
                      }}
                    >
                      {data.delta.toFixed(3)}
                    </div>
                  </motion.div>
                ))}
              </div>
              {statistics && (
                <div className="mt-3 flex justify-between text-xs text-gray-500 px-2">
                  <span>Min: ${statistics.putPrice.min.toFixed(2)}</span>
                  <span>Max: ${statistics.putPrice.max.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            This heat map illustrates how theoretical option prices and delta sensitivity change across volatility scenarios.
          </p>
          <p className="text-xs text-gray-500">
            Colors indicate relative intensity: warmer colors for higher values, cooler for lower values. 
            {activeMetric === 'delta' && ' Delta uses diverging colors: blue for negative, red for positive values.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VolatilityHeatMap;