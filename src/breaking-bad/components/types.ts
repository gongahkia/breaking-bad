
export interface CalculationResult {
  callOptionPrice: string
  putOptionPrice: string
  impliedVolatility: string
  delta: string
  timestamp: string
}

export interface FormData {
  strikePrice: string
  dividendYield: string
  timeToExpiration: string
}

export interface HeatMapData {
  volatility: number
  callPrice: number
  putPrice: number
  delta: number
}

export interface OptionRecommendation {
  type: 'call' | 'put'
  action: 'buy' | 'sell' | 'hold'
  reason: string
  confidence: 'high' | 'medium' | 'low'
  theoreticalPrice: number
  marketPrice: number
  priceDifference: number
}

export interface OptionInputs {
  stockPrice: number
  strikePrice: number
  interestRate: number
  dividendYield: number
  timeToExpiration: number
  volatility: number
}
