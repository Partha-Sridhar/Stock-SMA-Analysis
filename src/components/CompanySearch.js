import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, TrendingUp } from 'lucide-react';
import axios from 'axios';

const SearchContainer = styled.div`
  background: rgba(15, 15, 15, 0.8);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SearchTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 24px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SearchForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(20, 20, 20, 0.8);
  color: #ffffff;
  font-weight: 300;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
    background: rgba(25, 25, 25, 0.9);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SearchButton = styled.button`
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  border-left: 4px solid #c62828;
`;

const PopularTickers = styled.div`
  margin-top: 30px;
`;

const PopularTitle = styled.h3`
  color: #cccccc;
  margin-bottom: 15px;
  text-align: center;
`;

const TickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
`;

const TickerButton = styled.button`
  padding: 10px 15px;
  background: rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #667eea;

  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
    transform: translateY(-1px);
  }
`;

const CompanySearch = ({ onCompanySelect }) => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'QQQ', 'SPY', 'VTI'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/fetch-data`, {
        ticker: ticker.toUpperCase().trim()
      });

      onCompanySelect({
        ticker: ticker.toUpperCase().trim(),
        name: response.data.companyName || ticker.toUpperCase().trim(),
        data: response.data.data
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data. Please check the ticker symbol.');
    } finally {
      setLoading(false);
    }
  };

  const handleTickerClick = (selectedTicker) => {
    setTicker(selectedTicker);
  };

  return (
    <SearchContainer>
      <SearchTitle>
        <TrendingUp size={32} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
        Enter Company Ticker
      </SearchTitle>
      
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="e.g., AAPL, MSFT, GOOGL..."
          disabled={loading}
        />
        <SearchButton type="submit" disabled={loading || !ticker.trim()}>
          {loading ? <LoadingSpinner /> : <Search size={20} />}
          {loading ? 'Loading...' : 'Analyze'}
        </SearchButton>
      </SearchForm>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PopularTickers>
        <PopularTitle>Popular Tickers</PopularTitle>
        <TickerGrid>
          {popularTickers.map(t => (
            <TickerButton
              key={t}
              type="button"
              onClick={() => handleTickerClick(t)}
            >
              {t}
            </TickerButton>
          ))}
        </TickerGrid>
      </PopularTickers>
    </SearchContainer>
  );
};

export default CompanySearch;
