// types.ts

export interface CalculationResult {
  callOptionPrice: number | null; // Changed from string to number | null
  putOptionPrice: number | null;  // Changed from string to number | null
  impliedVolatility: number | null; // Changed from string to number | null
  delta: number | null;           // Changed from string to number | null
  timestamp: string;
  // Add these optional properties to match the server action's return
  callFormula?: string;
  putFormula?: string;
}

export interface FormData {
  strikePrice: string;
  dividendYield: string;
  timeToExpiration: string;
}

export interface HeatMapData {
  volatility: number;
  callPrice: number;
  putPrice: number;
  delta: number;
}

export interface OptionRecommendation {
  type: 'call' | 'put';
  action: 'buy' | 'sell' | 'hold';
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  theoreticalPrice: number;
  marketPrice: number;
  priceDifference: number;
}

export interface OptionInputs {
  stockPrice: number;
  strikePrice: number;
  interestRate: number;
  dividendYield: number;
  timeToExpiration: number;
  volatility: number;
}