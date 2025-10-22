#!/usr/bin/env python3
"""
Simple Yahoo Finance Scraper

Just specify a company name and get date + adjusted close price for entire lifespan.
"""

import yfinance as yf
import pandas as pd
import sys


def get_stock_data(company_name):
    """
    Get historical data for a company - just date and adjusted close price
    
    Args:
        company_name (str): Company ticker symbol (e.g., 'AAPL', 'MSFT', 'GOOGL')
    
    Returns:
        pandas.DataFrame: Data with Date and Adjusted Close columns
    """
    try:
        print(f"Fetching data for {company_name}...")
        
        # Create ticker object
        ticker = yf.Ticker(company_name)
        
        # Get all available historical data
        data = ticker.history(period="max")
        
        if data.empty:
            print(f"No data found for {company_name}")
            return None
        
        # Keep only Date and Adjusted Close
        result = pd.DataFrame({
            'Date': data.index,
            'Adjusted_Close': data['Close']  # yfinance uses 'Close' as adjusted close by default
        })
        
        # Reset index to make Date a regular column
        result = result.reset_index(drop=True)
        
        print(f"Successfully fetched {len(result)} records")
        print(f"Date range: {result['Date'].iloc[0].strftime('%Y-%m-%d')} to {result['Date'].iloc[-1].strftime('%Y-%m-%d')}")
        
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return None


def save_to_csv(data, company_name):
    """Save data to CSV file"""
    filename = f"{company_name}_historical_data.csv"
    data.to_csv(filename, index=False)
    print(f"Data saved to: {filename}")


def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python simple_scraper.py <COMPANY_TICKER>")
        print("Example: python simple_scraper.py AAPL")
        sys.exit(1)
    
    company_name = sys.argv[1].upper()
    
    # Get the data
    data = get_stock_data(company_name)
    
    if data is not None:
        # Show first few rows
        print("\nFirst 5 rows:")
        print(data.head())
        
        # Show last few rows
        print("\nLast 5 rows:")
        print(data.tail())
        
        # Save to CSV
        save_to_csv(data, company_name)
        
        print(f"\nDone! {len(data)} records saved to {company_name}_historical_data.csv")
    else:
        print("Failed to get data")


if __name__ == "__main__":
    main()
