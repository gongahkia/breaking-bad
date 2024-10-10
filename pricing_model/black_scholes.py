# core pricing logic is kept here

import numpy as np 
from scipy.stats import norm

def option_pricing(S0, X, r, q, t, v):
    """
    Calculate the price of a European call and put option using the Black-Scholes formula.

    Parameters:
    S0 : float : Initial stock price
    X : float : Strike price
    r : float : Risk-free interest rate
    q : float : Dividend yield
    t : float : Time to expiration (in years)
    v : float : Volatility of the stock price

    Returns:
    C : float : Call option price
    P : float : Put option price
    """
    d1 = (np.log(S0 / X) + (r - q + (v**2) / 2) * t) / (v * np.sqrt(t))
    d2 = d1 - v * np.sqrt(t)
    nd1 = norm.cdf(d1)
    nd2 = norm.cdf(d2)
    nd_1 = norm.cdf(-d1)
    nd_2 = norm.cdf(-d2)
    C = S0 * np.exp(-q * t) * nd1 - X * np.exp(-r * t) * nd2
    P = X * np.exp(-r * t) * nd_2 - S0 * np.exp(-q * t) * nd_1
    return C, P