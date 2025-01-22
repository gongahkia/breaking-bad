const axios = require('axios');

class YahooStockSpider {
    constructor(stocks = 'AAPL') {
        this.stocks = stocks.split(','); 
    }
    async fetchStockData(stock) {
        const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${stock}?formatted=false&modules=price%2CfinancialData%2CsummaryDetail`;
        try {
        const response = await axios.get(url);
        const data = response.data;
        const result = data.quoteSummary.result;
        if (result && result.length > 0) {
            return { [stock]: result[0] };
        } else {
            console.log(`No data found for ${stock}`);
            return null;
        }
        } catch (error) {
        console.error(`Error fetching data for ${stock}:`, error);
        return null;
        }
    }
    async scrape() {
        for (let stock of this.stocks) {
        const stockData = await this.fetchStockData(stock);
        if (stockData) {
            console.log(stockData);
        }
        }
    }
}

// const yahooStockSpider = new YahooStockSpider('AAPL,GOOGL');
// yahooStockSpider.scrape();