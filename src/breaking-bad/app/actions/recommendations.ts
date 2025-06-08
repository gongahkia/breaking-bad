// app/actions/recommendations.ts
"use server";

import { OptionRecommendation } from "../components/types";

export async function generateRecommendations(
  theoreticalCallPrice: number,
  marketCallPrice: number,
  theoreticalPutPrice: number,
  marketPutPrice: number
): Promise<OptionRecommendation[]> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const recommendations: OptionRecommendation[] = [];

  // --- Call Option Recommendation ---
  const callPriceDifference = marketCallPrice - theoreticalCallPrice;
  let callAction: 'buy' | 'sell' | 'hold';
  let callReason: string;
  let callConfidence: 'high' | 'medium' | 'low';

  if (callPriceDifference > theoreticalCallPrice * 0.10) { // Market price is significantly higher (overvalued)
    callAction = 'sell';
    callReason = `Market is overvaluing the call by ${(callPriceDifference / theoreticalCallPrice * 100).toFixed(1)}%. Consider selling.`;
    callConfidence = 'high';
  } else if (callPriceDifference < -theoreticalCallPrice * 0.10) { // Market price is significantly lower (undervalued)
    callAction = 'buy';
    callReason = `Market is undervaluing the call by ${(-callPriceDifference / theoreticalCallPrice * 100).toFixed(1)}%. Consider buying.`;
    callConfidence = 'high';
  } else if (Math.abs(callPriceDifference) > theoreticalCallPrice * 0.02) { // Slightly over/undervalued
    callAction = callPriceDifference > 0 ? 'sell' : 'buy';
    callReason = `Market is ${callPriceDifference > 0 ? 'slightly overvaluing' : 'slightly undervaluing'} the call. Monitor for clearer signals.`;
    callConfidence = 'medium';
  } else {
    callAction = 'hold';
    callReason = 'Market price is close to theoretical price. Hold for now.';
    callConfidence = 'low'; // Or medium, depending on desired strictness
  }

  recommendations.push({
    type: 'call',
    action: callAction,
    reason: callReason,
    confidence: callConfidence,
    theoreticalPrice: theoreticalCallPrice,
    marketPrice: marketCallPrice,
    priceDifference: callPriceDifference,
  });

  // --- Put Option Recommendation ---
  const putPriceDifference = marketPutPrice - theoreticalPutPrice;
  let putAction: 'buy' | 'sell' | 'hold';
  let putReason: string;
  let putConfidence: 'high' | 'medium' | 'low';

  if (putPriceDifference > theoreticalPutPrice * 0.10) { // Market price is significantly higher (overvalued)
    putAction = 'sell';
    putReason = `Market is overvaluing the put by ${(putPriceDifference / theoreticalPutPrice * 100).toFixed(1)}%. Consider selling.`;
    putConfidence = 'high';
  } else if (putPriceDifference < -theoreticalPutPrice * 0.10) { // Market price is significantly lower (undervalued)
    putAction = 'buy';
    putReason = `Market is undervaluing the put by ${(-putPriceDifference / theoreticalPutPrice * 100).toFixed(1)}%. Consider buying.`;
    putConfidence = 'high';
  } else if (Math.abs(putPriceDifference) > theoreticalPutPrice * 0.02) { // Slightly over/undervalued
    putAction = putPriceDifference > 0 ? 'sell' : 'buy';
    putReason = `Market is ${putPriceDifference > 0 ? 'slightly overvaluing' : 'slightly undervaluing'} the put. Monitor for clearer signals.`;
    putConfidence = 'medium';
  } else {
    putAction = 'hold';
    putReason = 'Market price is close to theoretical price. Hold for now.';
    putConfidence = 'low';
  }

  recommendations.push({
    type: 'put',
    action: putAction,
    reason: putReason,
    confidence: putConfidence,
    theoreticalPrice: theoreticalPutPrice,
    marketPrice: marketPutPrice,
    priceDifference: putPriceDifference,
  });

  return recommendations;
}