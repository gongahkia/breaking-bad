# ~ main function ~
    # to create ./lib/ and put all black scholz functions there
    # put all execution code here
import numpy as np 


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

    # Calculate d1 and d2
    d1 = (np.log(S0 / X) + (r - q + (v**2) / 2) * t) / (v * np.sqrt(t))
    d2 = d1 - v * np.sqrt(t)

    # Calculate the call and put option prices
    C = 1
    P = 1

    return C, P
def main():
    print("breaking bad")
    # Current price of the stock, also known as its spot price;
    S0 = 1
    # Strike price;
    X = 1
    # Time to the expiration of the options contract;
    t = 1
    # Risk-free interest rate, or the rate specified in the option for a given stable asset or short-dated government bonds such as US Treasury bills;
    r = 1
    # Expected volatility or unpredictability of the stock is expressed as the standard deviation of the stock price; and
    v = 1
    # Expected dividend yield.
    q = 1
    
    result = option_pricing(S0, X, r, q, t, v)
    print(result)


    return

if __name__ == "__main__":
    main()
