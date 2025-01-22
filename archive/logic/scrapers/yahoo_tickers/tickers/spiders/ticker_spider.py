import scrapy
import json

class YahooStockSpider(scrapy.Spider):

    name = "yahoo_stock_spider"

    def __init__(self, stocks=None, *args, **kwargs):
        super(YahooStockSpider, self).__init__(*args, **kwargs)
        self.stocks = stocks.split(',') if stocks else ['AAPL']

    def start_requests(self):
        for stock in self.stocks:
            url = f'https://query2.finance.yahoo.com/v10/finance/quoteSummary/{stock}?formatted=false&modules=price%2CfinancialData%2CsummaryDetail'
            yield scrapy.Request(url=url, callback=self.parse, meta={'stock': stock})

    def parse(self, response):
        stock = response.meta['stock']
        data = json.loads(response.body)
        result = data.get('quoteSummary', {}).get('result', [])
        if result:
            yield {stock: result[0]}