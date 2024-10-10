# helper functions to simplify main file code

def get_user_input(prompt, default_value):
    user_input = input(f"{prompt} (default {default_value}): ")
    return float(user_input) if user_input else default_value

def ask_user_for_details():
    S0 = get_user_input("Enter the current price of the stock (spot price)", 1)
    X = get_user_input("Enter the strike price", 1)
    t = get_user_input("Enter the time to expiration (in years)", 1)
    r = get_user_input("Enter the risk-free interest rate (as a whole number, e.g., 0.05 for 5%)", 1)
    v = get_user_input("Enter the expected volatility (as a whole number, e.g., 0.20 for 20%)", 1)
    q = get_user_input("Enter the expected dividend yield (as a whole number, e.g., 0.03 for 3%)", 1)
    return S0, X, r, q, t, v