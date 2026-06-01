## Treehouse's value prop

* Currently Treehouse is still very much focused on actual CryproCurrencies
* Framented on-chain interest rates make it very difficult to estimate the base rate, which makes it different to determine the optimal position any FinBro should adopt
* Treehouse offers
  * More stable, higher interests rates 
  * Aggregates across strategies and determines the risk-free interest rate for a particular asset

## BlackBeard's value prop

* Current DeFi platforms have varying interest rates for different StableCoins (Fragmented on-chain interest rates)
* BlackBeard would aim to fill the same niche Treehouse does for the StableCoin market 
    * More stable, higher interests rates 
    * Aggregates across strategies and determines the risk-free interest rate for a particular asset
* Implementation ideas
   * ***S&P 500 equivalent where we provide a basket of StableCoins to FinBros and they can purchase through us***
      1. Look @ Treehouse math/formulas within the [Whitepaper](https://www.treehouse.finance/tAsset_Whitepaper.pdf) and replicate it
          1. Backtesting our modified algorithm based on historical StableCoin data
          2. Tweak the algorithm as necessary to render net value 
      2. Considerations
          1. Current StableCoin lending rates fluctuate and might affect our strategy (need to be factored into the updated formuala)
          2. Current AltCoin strategies that TreeHouse applies to its CryptoCurrency leverage staking approach works because AltCoins have lower borrowing rates than StableCoins
              1. `ETH`
                  1. [Aave](https://app.aave.com/markets/)
                  2. [Lido](https://lido.fi/)
              2. `SOL`
                  1. [Jupiter](https://jup.ag/)
                  2. [Raydium](https://raydium.io/swap/)
                  3. [Meteora](https://www.meteora.ag/) 
   * Provide monetary-backed guarantees
      1. Extract StableCoins exchange rates over time
      2. Crunch numbers to create algorithm that
          1. Account for risk (black swan events) and historical estimates
          2. Reasonable risk-free rate that we can provide (variable costs, internal operation costs)
          3. Research what existing algorithms/methodologies there are 
      3. Things to consider
          1. Should FinBro withdrawal payouts be tagged to @-purchase-rates or current-exchange-rates
          2. Must consider fluctuating yield prices to guarantee the fixed return to FinBros if we adopt the monetary-backed guarantees
