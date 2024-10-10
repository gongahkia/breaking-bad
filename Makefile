all:start

configure:
	@pip install scipy

start:main.py
	@clear && python3 main.py