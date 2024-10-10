all:start

configure:
	@echo "(1/1) installing dependancies via pip..."
	@pip install scipy pandas urllib bs4

start:main.py
	@echo "executing main.py..."
	@clear && python3 main.py