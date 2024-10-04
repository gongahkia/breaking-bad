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

    # Calculate d1 and d2
    d1 = (np.log(S0 / X) + (r - q + (v**2) / 2) * t) / (v * np.sqrt(t))
    d2 = d1 - v * np.sqrt(t)

    #calculate the cumulative standard normal distribution of d1 and d2 (and their inverse)
    nd1 = norm.cdf(d1)
    nd2 = norm.cdf(d2)
    nd_1 = norm.cdf(-d1)
    nd_2 = norm.cdf(-d2)

    # Calculate the call and put option prices
    C = S0 * np.exp(-q * t) * nd1 - X * np.exp(-r * t) * nd2
    P = X * np.exp(-r * t) * nd_2 - S0 * np.exp(-q * t) * nd_1

    return C, P

def get_user_input(prompt, default_value):
    # This function asks the user for input and returns the value.
    user_input = input(f"{prompt} (default {default_value}): ")
    return float(user_input) if user_input else default_value

# Prompting user for details with default values
def ask_user_for_details():
    S0 = get_user_input("Enter the current price of the stock (spot price)", 1)
    X = get_user_input("Enter the strike price", 1)
    t = get_user_input("Enter the time to expiration (in years)", 1)
    r = get_user_input("Enter the risk-free interest rate (as a decimal, e.g., 0.05 for 5%)", 1)
    v = get_user_input("Enter the expected volatility (as a decimal, e.g., 0.2 for 20%)", 1)
    q = get_user_input("Enter the expected dividend yield (as a decimal, e.g., 0.03 for 3%)", 1)

    # Return the collected inputs
    return S0, X, r, q, t, v

def main():
    """
    This is the main function within which
    all execution code is found and run
    """
    print("breaking bad")

    # Collect user details
    S0, X, r, q, t, v = ask_user_for_details()

    # Call the option_pricing function with the collected details 
    result = option_pricing(S0, X, r, q, t, v)
    print("call price:", result[0]) 
    print("put price: ", result[1]) 

    return

if __name__ == "__main__":
    main()
