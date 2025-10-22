#!/usr/bin/env python3
"""
Backend API server for SMA Dashboard
Handles data fetching and processing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import os
import sys

app = Flask(__name__)
CORS(app)

def fetch_and_process_data(ticker):
    """
    Fetch historical data and calculate SMAs
    """
    try:
        print(f"Fetching data for {ticker}...")
        
        # Create ticker object
        stock = yf.Ticker(ticker)
        
        # Get company info
        info = stock.info
        company_name = info.get('longName', ticker)
        
        # Fetch historical data
        data = stock.history(period="max")
        
        if data.empty:
            raise ValueError(f"No data found for ticker {ticker}")
        
        # Reset index to make Date a column
        data = data.reset_index()
        
        # Keep only necessary columns
        result_data = []
        for _, row in data.iterrows():
            result_data.append({
                'Date': row['Date'].isoformat(),
                'Adjusted_Close': float(row['Close'])  # Using Close as adjusted close
            })
        
        # Calculate SMAs
        df = pd.DataFrame(result_data)
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date').reset_index(drop=True)
        
        # Calculate different SMA periods
        sma_periods = [10, 20, 30, 40, 50, 100]
        for period in sma_periods:
            df[f'SMA_{period}'] = df['Adjusted_Close'].rolling(window=period).mean()
        
        # Convert back to list of dictionaries
        processed_data = []
        for _, row in df.iterrows():
            item = {
                'Date': row['Date'].isoformat(),
                'Adjusted_Close': float(row['Adjusted_Close'])
            }
            
            for period in sma_periods:
                sma_value = row[f'SMA_{period}']
                item[f'SMA_{period}'] = float(sma_value) if pd.notna(sma_value) else None
            
            processed_data.append(item)
        
        return {
            'companyName': company_name,
            'ticker': ticker,
            'data': processed_data,
            'totalRecords': len(processed_data),
            'dateRange': {
                'start': processed_data[0]['Date'] if processed_data else None,
                'end': processed_data[-1]['Date'] if processed_data else None
            }
        }
        
    except Exception as e:
        print(f"Error processing {ticker}: {str(e)}")
        raise e

@app.route('/api/fetch-data', methods=['POST'])
def fetch_data():
    """
    API endpoint to fetch and process stock data
    """
    try:
        data = request.get_json()
        ticker = data.get('ticker', '').upper().strip()
        
        if not ticker:
            return jsonify({'error': 'Ticker symbol is required'}), 400
        
        # Fetch and process data
        result = fetch_and_process_data(ticker)
        
        return jsonify(result)
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to fetch data: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/popular-tickers', methods=['GET'])
def popular_tickers():
    """
    Get list of popular ticker symbols
    """
    popular = [
        {'ticker': 'AAPL', 'name': 'Apple Inc.'},
        {'ticker': 'MSFT', 'name': 'Microsoft Corporation'},
        {'ticker': 'GOOGL', 'name': 'Alphabet Inc.'},
        {'ticker': 'AMZN', 'name': 'Amazon.com Inc.'},
        {'ticker': 'TSLA', 'name': 'Tesla Inc.'},
        {'ticker': 'META', 'name': 'Meta Platforms Inc.'},
        {'ticker': 'NVDA', 'name': 'NVIDIA Corporation'},
        {'ticker': 'QQQ', 'name': 'Invesco QQQ Trust'},
        {'ticker': 'SPY', 'name': 'SPDR S&P 500 ETF Trust'},
        {'ticker': 'VTI', 'name': 'Vanguard Total Stock Market ETF'}
    ]
    
    return jsonify(popular)

if __name__ == '__main__':
    # Get configuration from environment variables
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_ENV', 'production') == 'development'
    
    print("Starting SMA Dashboard API server...")
    print(f"Server will be available at: http://{host}:{port}")
    print("API endpoints:")
    print("  POST /api/fetch-data - Fetch stock data with SMAs")
    print("  GET  /api/health - Health check")
    print("  GET  /api/popular-tickers - Get popular tickers")
    
    app.run(debug=debug, host=host, port=port)
