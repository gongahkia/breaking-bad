import pandas as pd
import urllib.request as ur
from bs4 import BeautifulSoup
import warnings

def yahoo_income_statement(ticker='AAPL'):
    income_url = f'https://finance.yahoo.com/quote/{ticker}/financials?p={ticker}'
    read_url = ur.urlopen(income_url).read()
    income_soup = BeautifulSoup(read_url, 'lxml')
    div_list = []
    for div in income_soup.find_all('div'):
        div_list.append(div.string)
        if not div.string == div.get('title'):
            div_list.append(div.get('title'))
    div_list = [incl for incl in div_list if incl not in ('Operating Expenses', 'Non-recurring Events', 'Expand All')]
    div_list = list(filter(None, div_list))
    div_list = [incl for incl in div_list if not incl.startswith('(function')]
    income_list = div_list[13: -5]
    income_list.insert(0, 'Breakdown')
    income_data = list(zip(*[iter(income_list)]*6))
    income_df = pd.DataFrame(income_data)
    headers = income_df.iloc[0]
    income_df = income_df[1:]
    income_df.columns = headers
    income_df.set_index('Breakdown', inplace=True, drop=True)
    warnings.warn('Amounts are in thousands.')
    return income_df

def yahoo_balance_sheet(ticker='AAPL'):
    balancesheet_url = f'https://finance.yahoo.com/quote/{ticker}/balance-sheet?p={ticker}'
    read_url = ur.urlopen(balancesheet_url).read()
    balancesheet_soup = BeautifulSoup(read_url, 'lxml')
    div_list = []
    for div in balancesheet_soup.find_all('div'):
        div_list.append(div.string)
        if not div.string == div.get('title'):
            div_list.append(div.get('title'))
    div_list = [incl for incl in div_list if incl not in ('Operating Expenses', 'Non-recurring Events', 'Expand All')]
    div_list = list(filter(None, div_list))
    div_list = [incl for incl in div_list if not incl.startswith('(function')]
    balancesheet_list = div_list[13: -5]
    balancesheet_list.insert(0, 'Breakdown')
    balancesheet_data = list(zip(*[iter(balancesheet_list)]*5))
    balancesheet_df = pd.DataFrame(balancesheet_data)
    headers = balancesheet_df.iloc[0]
    balancesheet_df = balancesheet_df[1:]
    balancesheet_df.columns = headers
    balancesheet_df.set_index('Breakdown', inplace=True, drop=True)
    warnings.warn('Amounts are in thousands.')
    return balancesheet_df

def yahoo_cash_flow(ticker='AAPL'):
    cashflow_url = f'https://finance.yahoo.com/quote/{ticker}/cash-flow?p={ticker}'
    read_url = ur.urlopen(cashflow_url).read()
    cashflow_soup = BeautifulSoup(read_url, 'lxml')
    div_list = []
    for div in cashflow_soup.find_all('div'):
        div_list.append(div.string)
        if not div.string == div.get('title'):
            div_list.append(div.get('title'))
    div_list = [incl for incl in div_list if incl not in ('Operating Expenses', 'Non-recurring Events', 'Expand All')]
    div_list = list(filter(None, div_list))
    div_list = [incl for incl in div_list if not incl.startswith('(function')]
    cashflow_list = div_list[13: -5]
    cashflow_list.insert(0, 'Breakdown')
    cashflow_data = list(zip(*[iter(cashflow_list)]*6))
    cashflow_df = pd.DataFrame(cashflow_data)
    headers = cashflow_df.iloc[0]
    cashflow_df = cashflow_df[1:]
    cashflow_df.columns = headers
    cashflow_df.set_index('Breakdown', inplace=True, drop=True)
    warnings.warn('Amounts are in thousands.')
    return cashflow_df