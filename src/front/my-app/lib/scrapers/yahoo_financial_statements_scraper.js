const axios = require('axios');
const cheerio = require('cheerio');

async function yahooIncomeStatement(ticker = 'AAPL') {
  const incomeUrl = `https://finance.yahoo.com/quote/${ticker}/financials?p=${ticker}`;
  try {
    const { data } = await axios.get(incomeUrl);
    const $ = cheerio.load(data);
    let divList = [];
    $('div').each((i, div) => {
      const text = $(div).text().trim();
      if (text) {
        divList.push(text);
      }
    });
    divList = divList.filter(item => !['Operating Expenses', 'Non-recurring Events', 'Expand All'].includes(item));
    divList = divList.filter(item => item && !item.startsWith('(function'));
    let incomeList = divList.slice(13, -5);
    incomeList.unshift('Breakdown');
    const incomeData = [];
    for (let i = 0; i < incomeList.length; i += 6) {
      incomeData.push(incomeList.slice(i, i + 6));
    }
    const headers = incomeData[0];
    incomeData.shift();
    const incomeObj = incomeData.map(row => {
      let result = {};
      headers.forEach((header, i) => {
        result[header] = row[i];
      });
      return result;
    });
    console.warn('Amounts are in thousands.');
    return incomeObj;
  } catch (error) {
    console.error('Error fetching income statement:', error);
  }
}

async function yahooBalanceSheet(ticker = 'AAPL') {
  const balanceSheetUrl = `https://finance.yahoo.com/quote/${ticker}/balance-sheet?p=${ticker}`;
  try {
    const { data } = await axios.get(balanceSheetUrl);
    const $ = cheerio.load(data);
    let divList = [];
    $('div').each((i, div) => {
      const text = $(div).text().trim();
      if (text) {
        divList.push(text);
      }
    });
    divList = divList.filter(item => !['Operating Expenses', 'Non-recurring Events', 'Expand All'].includes(item));
    divList = divList.filter(item => item && !item.startsWith('(function'));
    let balanceSheetList = divList.slice(13, -5);
    balanceSheetList.unshift('Breakdown');
    const balanceSheetData = [];
    for (let i = 0; i < balanceSheetList.length; i += 5) {
      balanceSheetData.push(balanceSheetList.slice(i, i + 5));
    }
    const headers = balanceSheetData[0];
    balanceSheetData.shift();
    const balanceSheetObj = balanceSheetData.map(row => {
      let result = {};
      headers.forEach((header, i) => {
        result[header] = row[i];
      });
      return result;
    });
    console.warn('Amounts are in thousands.');
    return balanceSheetObj;
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
  }
}

async function yahooCashFlow(ticker = 'AAPL') {
  const cashFlowUrl = `https://finance.yahoo.com/quote/${ticker}/cash-flow?p=${ticker}`;
  try {
    const { data } = await axios.get(cashFlowUrl);
    const $ = cheerio.load(data);
    let divList = [];
    $('div').each((i, div) => {
      const text = $(div).text().trim();
      if (text) {
        divList.push(text);
      }
    });
    divList = divList.filter(item => !['Operating Expenses', 'Non-recurring Events', 'Expand All'].includes(item));
    divList = divList.filter(item => item && !item.startsWith('(function'));
    let cashFlowList = divList.slice(13, -5);
    cashFlowList.unshift('Breakdown');
    const cashFlowData = [];
    for (let i = 0; i < cashFlowList.length; i += 6) {
      cashFlowData.push(cashFlowList.slice(i, i + 6));
    }
    const headers = cashFlowData[0];
    cashFlowData.shift();
    const cashFlowObj = cashFlowData.map(row => {
      let result = {};
      headers.forEach((header, i) => {
        result[header] = row[i];
      });
      return result;
    });
    console.warn('Amounts are in thousands.');
    return cashFlowObj;
  } catch (error) {
    console.error('Error fetching cash flow:', error);
  }
}

// yahooIncomeStatement('AAPL').then(data => console.log(data));
// yahooBalanceSheet('AAPL').then(data => console.log(data));
// yahooCashFlow('AAPL').then(data => console.log(data));