# !NOTE
    # this code is never to go into production
    # the main execution code for testing purposes lives here

import pricing_model.helper as h
import pricing_model.black_scholes as bs

def main():
    print(f"{'~' * 10} breaking bad {'~' * 10}")
    S0, X, r, q, t, v = h.ask_user_for_details()
    result = bs.option_pricing(S0, X, r, q, t, v)
    print("Call price:", round(result[0], 3)) 
    print("Put price:", round(result[1], 3))
    return

if __name__ == "__main__":
    main()