all:configure

configure:
	@echo "installing dependancies..."
	@pip install scipy pandas urllib bs4 requests scrapy
	@npm install express