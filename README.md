# 📈 Interactive SMA Dashboard

A modern, interactive web application for analyzing Simple Moving Averages (SMA) with hover functionality and detailed visualizations.

## ✨ Features

- **🔍 Company Search**: Enter any ticker symbol to analyze
- **📊 SMA Gallery**: Visual overview of SMA 10, 20, 30, 50
- **🎯 Interactive Charts**: Hover to see exact values, dates, and percentages
- **📈 Detailed Analysis**: Click any SMA for in-depth view
- **📱 Responsive Design**: Works on desktop and mobile
- **⚡ Real-time Data**: Live data from Yahoo Finance

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

### 2. Start the Backend Server

```bash
python server.py
```

### 3. Start the React App

```bash
npm start
```

### 4. Open Your Browser

Navigate to `http://localhost:3000`

## 🎯 How to Use

### Step 1: Search for a Company
- Enter a ticker symbol (e.g., AAPL, MSFT, GOOGL)
- Click "Analyze" or select from popular tickers
- Wait for data to load

### Step 2: Explore SMA Gallery
- View all SMA periods (10, 20, 30, 50) at once
- See mini-charts with key statistics
- Click any SMA card for detailed analysis

### Step 3: Detailed SMA Analysis
- **Main Chart**: Price vs SMA with hover details
- **Percentage Chart**: Signed difference over time
- **Statistics**: Current values, averages, extremes
- **Hover Data**: Exact price, SMA, date, and percentage difference

## 📊 What You Get

### Interactive Hover Information
When you hover over any point:
- **Date**: Exact trading date
- **Price**: Current stock price
- **SMA**: Moving average value
- **Difference**: Signed percentage difference

### Key Statistics
- Current price and SMA values
- Average percentage difference
- Maximum and minimum differences
- Days above/below SMA
- Total data points

### Visual Indicators
- **Green**: Price above SMA (bullish)
- **Red**: Price below SMA (bearish)
- **Smooth lines**: SMA trends
- **Area charts**: Percentage differences

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern UI framework
- **Recharts**: Interactive charts
- **Styled Components**: CSS-in-JS styling
- **Lucide React**: Beautiful icons

### Backend
- **Flask**: Python web framework
- **yfinance**: Yahoo Finance data
- **Pandas**: Data processing
- **NumPy**: Numerical calculations

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CompanySearch.js      # Company search interface
│   │   ├── SMAGallery.js         # SMA overview gallery
│   │   └── SMADetailView.js      # Detailed SMA analysis
│   ├── styles/
│   │   └── GlobalStyle.js        # Global CSS styles
│   ├── App.js                     # Main application
│   └── index.js                   # React entry point
├── public/
│   └── index.html                 # HTML template
├── server.py                      # Backend API server
├── package.json                   # Node.js dependencies
└── requirements.txt               # Python dependencies
```

## 🔧 API Endpoints

### `POST /api/fetch-data`
Fetch historical data with SMAs for a ticker symbol.

**Request:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "companyName": "Apple Inc.",
  "ticker": "AAPL",
  "data": [...],
  "totalRecords": 6696,
  "dateRange": {
    "start": "1999-03-10T00:00:00",
    "end": "2025-10-20T00:00:00"
  }
}
```

### `GET /api/health`
Health check endpoint.

### `GET /api/popular-tickers`
Get list of popular ticker symbols.

## 🎨 Customization

### Adding New SMA Periods
Edit `server.py` and update the `sma_periods` list:

```python
sma_periods = [5, 10, 20, 30, 50, 100, 200]
```

### Changing Colors
Update the color arrays in the React components:

```javascript
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
```

### Adding New Statistics
Extend the `calculateStats` function in `SMAGallery.js` and `SMADetailView.js`.

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Mobile Support

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to fetch data"**
   - Check if ticker symbol is correct
   - Ensure internet connection
   - Verify backend server is running

2. **Charts not loading**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Try refreshing the page

3. **Backend connection issues**
   - Verify server is running on port 5000
   - Check CORS settings
   - Ensure Python dependencies are installed

### Debug Mode
```bash
# Backend with debug
python server.py

# Frontend with debug
REACT_APP_DEBUG=true npm start
```

## 📈 Performance Tips

- Use smaller date ranges for faster loading
- Cache data for frequently accessed tickers
- Implement data pagination for large datasets
- Use Web Workers for heavy calculations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Yahoo Finance for providing free market data
- React and Recharts communities
- Flask and Python ecosystem
- All contributors and users

---

**Happy Trading! 📈📊**