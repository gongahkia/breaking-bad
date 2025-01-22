"use server"

interface OptionInputs {
  stockPrice: number
  strikePrice: number
  interestRate: number
  dividendYield: number
  timeToExpiration: number
  volatility: number
}

export async function calculateOption(inputs: OptionInputs) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const { stockPrice, strikePrice, interestRate, timeToExpiration, volatility } = inputs
  const d1 =
    (Math.log(stockPrice / strikePrice) + (interestRate + Math.pow(volatility, 2) / 2) * timeToExpiration) /
    (volatility * Math.sqrt(timeToExpiration))
  const callPrice = (stockPrice * normalCDF(d1)).toFixed(2)
  const putPrice = (strikePrice * normalCDF(-d1)).toFixed(2)
  return {
    callOptionPrice: callPrice,
    putOptionPrice: putPrice,
    impliedVolatility: (volatility * 100).toFixed(1) + "%",
    delta: normalCDF(d1).toFixed(3),
    timestamp: new Date().toISOString(),
  }
}

function normalCDF(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - p : p
}