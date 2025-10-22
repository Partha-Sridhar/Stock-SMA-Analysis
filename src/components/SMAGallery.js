import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GalleryContainer = styled.div`
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;
  font-weight: 600;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

const CompanyInfo = styled.div`
  text-align: center;
`;

const CompanyName = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 2.5rem;
`;

const CompanyTicker = styled.p`
  color: #cccccc;
  margin: 5px 0 0 0;
  font-size: 1.2rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px;
  color: #cccccc;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SMAGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const SMACard = styled.div`
  background: #1a1a1a;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: #667eea;
  }
`;

const SMATitle = styled.h3`
  color: #ffffff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartContainer = styled.div`
  height: 200px;
  margin-bottom: 15px;
`;

const SMAStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 10px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cccccc;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
`;

const ClickHint = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #cccccc;
  font-style: italic;
`;

const SMAGallery = ({ company, onSMASelect, onBack, onDataLoad }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company?.data) {
      setData(company.data);
      onDataLoad(company.data);
      setLoading(false);
    }
  }, [company, onDataLoad]);

  const smaPeriods = [10, 20, 30, 50];
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];

  const formatDataForChart = (smaPeriod) => {
    if (!data) return [];
    
    return data.map(item => ({
      date: new Date(item.Date).toLocaleDateString(),
      price: parseFloat(item.Adjusted_Close),
      sma: parseFloat(item[`SMA_${smaPeriod}`]) || null
    })).filter(item => item.sma !== null);
  };

  const calculateStats = (smaPeriod) => {
    if (!data) return { avgDiff: 0, maxDiff: 0, minDiff: 0, daysAbove: 0 };
    
    const validData = data.filter(item => item[`SMA_${smaPeriod}`] !== null);
    const diffs = validData.map(item => {
      const price = parseFloat(item.Adjusted_Close);
      const sma = parseFloat(item[`SMA_${smaPeriod}`]);
      return ((price - sma) / sma) * 100;
    });
    
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const maxDiff = Math.max(...diffs);
    const minDiff = Math.min(...diffs);
    const daysAbove = diffs.filter(d => d > 0).length;
    
    return { avgDiff, maxDiff, minDiff, daysAbove, totalDays: diffs.length };
  };

  if (loading) {
    return (
      <GalleryContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading SMA analysis for {company?.ticker}...</p>
        </LoadingContainer>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Search
        </BackButton>
        <CompanyInfo>
          <CompanyName>{company?.name}</CompanyName>
          <CompanyTicker>{company?.ticker}</CompanyTicker>
        </CompanyInfo>
        <div></div>
      </Header>

      <SMAGrid>
        {smaPeriods.map((period, index) => {
          const chartData = formatDataForChart(period);
          const stats = calculateStats(period);
          
          return (
            <SMACard key={period} onClick={() => onSMASelect(period)}>
              <SMATitle>
                <BarChart3 size={24} color={colors[index]} />
                SMA {period}
              </SMATitle>
              
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.slice(-50)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: '#cccccc' }}
                      interval="preserveStartEnd"
                      stroke="#cccccc"
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#cccccc' }}
                      stroke="#cccccc"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(30, 30, 30, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        color: '#ffffff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#ffffff" 
                      strokeWidth={3}
                      dot={false}
                      strokeOpacity={0.9}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sma" 
                      stroke={colors[index]} 
                      strokeWidth={3}
                      dot={false}
                      strokeOpacity={0.9}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <SMAStats>
                <StatItem>
                  <StatLabel>Avg % Diff</StatLabel>
                  <StatValue>{stats.avgDiff.toFixed(2)}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Days Above</StatLabel>
                  <StatValue>{((stats.daysAbove / stats.totalDays) * 100).toFixed(1)}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Max % Diff</StatLabel>
                  <StatValue>{stats.maxDiff.toFixed(2)}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Min % Diff</StatLabel>
                  <StatValue>{stats.minDiff.toFixed(2)}%</StatValue>
                </StatItem>
              </SMAStats>
            </SMACard>
          );
        })}
      </SMAGrid>
      
      <ClickHint>
        Click on any SMA card to view detailed analysis with interactive hover data
      </ClickHint>
    </GalleryContainer>
  );
};

export default SMAGallery;
