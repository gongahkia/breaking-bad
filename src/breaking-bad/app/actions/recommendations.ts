// app/actions/recommendations.ts
"use server";

import { OptionRecommendation } from "../../components/types";

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
  const callPriceDifferencePercent = (callPriceDifference / theoreticalCallPrice) * 100;
  let callAction: 'buy' | 'sell' | 'hold';
  let callReason: string;
  let callConfidence: 'high' | 'medium' | 'low';

  if (callPriceDifference > theoreticalCallPrice * 0.10) {
    callAction = 'sell';
    callReason = `Strong Sell Signal: Market price is ${callPriceDifferencePercent.toFixed(1)}% above theoretical value. This significant premium suggests an overvalued call option.`;
    callConfidence = 'high';
  } else if (callPriceDifference < -theoreticalCallPrice * 0.10) {
    callAction = 'buy';
    callReason = `Strong Buy Signal: Market price is ${Math.abs(callPriceDifferencePercent).toFixed(1)}% below theoretical value. This significant discount presents a potential buying opportunity.`;
    callConfidence = 'high';
  } else if (Math.abs(callPriceDifference) > theoreticalCallPrice * 0.02) {
    callAction = callPriceDifference > 0 ? 'sell' : 'buy';
    callReason = `Moderate ${callAction === 'buy' ? 'Buy' : 'Sell'} Signal: Market price is ${Math.abs(callPriceDifferencePercent).toFixed(1)}% ${callPriceDifference > 0 ? 'above' : 'below'} theoretical value. Consider ${callAction === 'buy' ? 'buying' : 'selling'} with careful monitoring.`;
    callConfidence = 'medium';
  } else {
    callAction = 'hold';
    callReason = `Neutral Position: Market price closely aligns with theoretical value (${Math.abs(callPriceDifferencePercent).toFixed(1)}% difference). Current market conditions suggest holding your position.`;
    callConfidence = 'low';
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
  const putPriceDifferencePercent = (putPriceDifference / theoreticalPutPrice) * 100;
  let putAction: 'buy' | 'sell' | 'hold';
  let putReason: string;
  let putConfidence: 'high' | 'medium' | 'low';

  if (putPriceDifference > theoreticalPutPrice * 0.10) {
    putAction = 'sell';
    putReason = `Strong Sell Signal: Market price is ${putPriceDifferencePercent.toFixed(1)}% above theoretical value. This significant premium suggests an overvalued put option.`;
    putConfidence = 'high';
  } else if (putPriceDifference < -theoreticalPutPrice * 0.10) {
    putAction = 'buy';
    putReason = `Strong Buy Signal: Market price is ${Math.abs(putPriceDifferencePercent).toFixed(1)}% below theoretical value. This significant discount presents a potential buying opportunity.`;
    putConfidence = 'high';
  } else if (Math.abs(putPriceDifference) > theoreticalPutPrice * 0.02) {
    putAction = putPriceDifference > 0 ? 'sell' : 'buy';
    putReason = `Moderate ${putAction === 'buy' ? 'Buy' : 'Sell'} Signal: Market price is ${Math.abs(putPriceDifferencePercent).toFixed(1)}% ${putPriceDifference > 0 ? 'above' : 'below'} theoretical value. Consider ${putAction === 'buy' ? 'buying' : 'selling'} with careful monitoring.`;
    putConfidence = 'medium';
  } else {
    putAction = 'hold';
    putReason = `Neutral Position: Market price closely aligns with theoretical value (${Math.abs(putPriceDifferencePercent).toFixed(1)}% difference). Current market conditions suggest holding your position.`;
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