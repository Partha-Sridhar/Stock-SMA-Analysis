import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';

const DetailContainer = styled.div`
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

const Title = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-top: 30px;
`;

const ChartCard = styled.div`
  background: #1a1a1a;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChartTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const StatCard = styled.div`
  background: #1a1a1a;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  background: ${props => props.color || '#667eea'};
  color: white;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cccccc;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
`;

const TimeRangeSelector = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const TimeRangeTitle = styled.h4`
  color: #ffffff;
  margin: 0 0 10px 0;
  font-size: 1rem;
`;

const TimeRangeInputs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const PresetButtons = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const PresetButton = styled.button`
  padding: 5px 10px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 5px;
  color: #667eea;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
  }
`;

const DateInput = styled.input`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 8px;
  color: #ffffff;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  
  /* Force scrollbar to always be visible */
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 126, 234, 0.8) rgba(255, 255, 255, 0.1);
  
  &::-webkit-scrollbar {
    height: 16px;
    width: 16px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.8);
    border-radius: 8px;
    border: 2px solid rgba(30, 30, 30, 0.8);
    min-width: 20px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 1);
  }
  
  &::-webkit-scrollbar-corner {
    background: rgba(30, 30, 30, 0.8);
  }
  
  /* Ensure scrollbar is always visible */
  &::-webkit-scrollbar:horizontal {
    height: 16px;
  }
`;

const ChartWrapper = styled.div`
  min-width: ${props => props.minWidth || '800px'};
  height: 100%;
`;

const ScrollControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const ScrollButton = styled.button`
  padding: 8px 12px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 5px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
  }
`;

const YearIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 10px;
  padding: 10px 15px;
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
  z-index: 10;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 5px 10px;
  color: #cccccc;
  font-size: 0.8rem;
  z-index: 10;
`;

const ScaleIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 5px;
  padding: 5px 10px;
  color: #667eea;
  font-size: 0.8rem;
  z-index: 10;
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.date).toLocaleDateString();
    const price = data.price;
    const sma = data.sma;
    const percentageDiff = data.percentageDiff;
    
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
          {date}
        </div>
        <div style={{ marginBottom: '4px', color: '#333' }}>
          <strong>Price:</strong> ${price.toFixed(2)}
        </div>
        <div style={{ marginBottom: '4px', color: '#667eea' }}>
          <strong>SMA {data.smaPeriod}:</strong> ${sma.toFixed(2)}
        </div>
        <div style={{ 
          color: percentageDiff >= 0 ? '#4caf50' : '#f44336',
          fontWeight: '600'
        }}>
          <strong>Difference:</strong> {percentageDiff >= 0 ? '+' : ''}{percentageDiff.toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};

const SMADetailView = ({ company, smaPeriod, data, onBack }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const priceChartRef = useRef(null);
  const percentageChartRef = useRef(null);

  const processedData = useMemo(() => {
    if (!data) return [];
    
    return data
      .filter(item => item[`SMA_${smaPeriod}`] !== null)
      .map(item => {
        const price = parseFloat(item.Adjusted_Close);
        const sma = parseFloat(item[`SMA_${smaPeriod}`]);
        const percentageDiff = ((price - sma) / sma) * 100;
        
        return {
          date: new Date(item.Date),
          price,
          sma,
          percentageDiff,
          smaPeriod
        };
      });
  }, [data, smaPeriod]);

  // Initialize with first year of data
  useEffect(() => {
    if (processedData.length > 0 && !currentYear) {
      const firstDate = processedData[0].date;
      const year = firstDate.getFullYear();
      setCurrentYear(year);
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
    }
  }, [processedData, currentYear]);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!processedData.length) return processedData;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return processedData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    // Fallback to current year if no date range set
    if (currentYear) {
      return processedData.filter(item => {
        const year = item.date.getFullYear();
        return year === currentYear;
      });
    }
    
    return processedData;
  }, [processedData, startDate, endDate, currentYear]);

  // Calculate dynamic Y-axis scale for price chart
  const priceScale = useMemo(() => {
    if (!filteredData.length) return { min: 0, max: 100 };
    
    const prices = filteredData.map(d => d.price);
    const smas = filteredData.map(d => d.sma).filter(sma => sma !== null);
    const allValues = [...prices, ...smas];
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    // Add 5% padding above and below
    const padding = (max - min) * 0.05;
    
    return {
      min: Math.max(0, min - padding),
      max: max + padding
    };
  }, [filteredData]);

  // Calculate dynamic Y-axis scale for percentage chart
  const percentageScale = useMemo(() => {
    if (!filteredData.length) return { min: -10, max: 10 };
    
    const percentages = filteredData.map(d => d.percentageDiff);
    const min = Math.min(...percentages);
    const max = Math.max(...percentages);
    
    // Add 10% padding above and below
    const padding = Math.max(Math.abs(min), Math.abs(max)) * 0.1;
    
    return {
      min: min - padding,
      max: max + padding
    };
  }, [filteredData]);

  // Handle synchronized hover
  const handleSynchronizedHover = (data, index) => {
    setActiveIndex(index);
    setHoveredData(data);
  };

  // Custom tooltip with synchronized data
  const SynchronizedTooltip = ({ active, payload, label, chartType }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.date).toLocaleDateString();
      const price = data.price;
      const sma = data.sma;
      const percentageDiff = data.percentageDiff;
      
      return (
        <div style={{
          background: 'rgba(30, 30, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          color: '#ffffff'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>
            {date}
          </div>
          <div style={{ marginBottom: '4px', color: '#ffffff' }}>
            <strong>Price:</strong> ${price.toFixed(2)}
          </div>
          <div style={{ marginBottom: '4px', color: '#667eea' }}>
            <strong>SMA {data.smaPeriod}:</strong> ${sma.toFixed(2)}
          </div>
          <div style={{ 
            color: percentageDiff >= 0 ? '#4caf50' : '#f44336',
            fontWeight: '600'
          }}>
            <strong>Difference:</strong> {percentageDiff >= 0 ? '+' : ''}{percentageDiff.toFixed(2)}%
          </div>
        </div>
      );
    }
    return null;
  };

  // Get available years
  const availableYears = useMemo(() => {
    if (!processedData.length) return [];
    
    const years = [...new Set(processedData.map(item => item.date.getFullYear()))];
    return years.sort();
  }, [processedData]);

  // Navigate to previous/next year
  const navigateYear = (direction) => {
    const currentIndex = availableYears.indexOf(currentYear);
    if (direction === 'prev' && currentIndex > 0) {
      const newYear = availableYears[currentIndex - 1];
      setCurrentYear(newYear);
      setStartDate(`${newYear}-01-01`);
      setEndDate(`${newYear}-12-31`);
    } else if (direction === 'next' && currentIndex < availableYears.length - 1) {
      const newYear = availableYears[currentIndex + 1];
      setCurrentYear(newYear);
      setStartDate(`${newYear}-01-01`);
      setEndDate(`${newYear}-12-31`);
    }
  };

  // Sync scroll between charts
  const handleScroll = (sourceRef, targetRef) => {
    if (sourceRef.current && targetRef.current) {
      const sourceScrollLeft = sourceRef.current.scrollLeft;
      targetRef.current.scrollLeft = sourceScrollLeft;
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    // Update current year based on the date range
    if (newStartDate) {
      const year = new Date(newStartDate).getFullYear();
      setCurrentYear(year);
    }
  };

  // Handle preset date ranges
  const handlePresetRange = (preset) => {
    const today = new Date();
    let start, end;
    
    switch (preset) {
      case '1year':
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        end = today;
        break;
      case '2years':
        start = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
        end = today;
        break;
      case '5years':
        start = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
        end = today;
        break;
      case 'all':
        if (processedData.length > 0) {
          start = new Date(processedData[0].date);
          end = new Date(processedData[processedData.length - 1].date);
        }
        break;
      default:
        return;
    }
    
    if (start && end) {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      setCurrentYear(start.getFullYear());
    }
  };

  // Get current year display
  const getCurrentYearDisplay = () => {
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      if (startYear === endYear) {
        return `${startYear}`;
      } else {
        return `${startYear}-${endYear}`;
      }
    }
    return currentYear ? `${currentYear}` : 'Loading...';
  };

  const stats = useMemo(() => {
    if (!processedData.length) return {};
    
    const diffs = processedData.map(d => d.percentageDiff);
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const maxDiff = Math.max(...diffs);
    const minDiff = Math.min(...diffs);
    const daysAbove = diffs.filter(d => d > 0).length;
    const currentPrice = processedData[processedData.length - 1]?.price || 0;
    const currentSMA = processedData[processedData.length - 1]?.sma || 0;
    const currentDiff = processedData[processedData.length - 1]?.percentageDiff || 0;
    
    return {
      avgDiff,
      maxDiff,
      minDiff,
      daysAbove,
      totalDays: diffs.length,
      currentPrice,
      currentSMA,
      currentDiff
    };
  }, [processedData]);

  const color = smaPeriod === 10 ? '#ff6b6b' : 
                smaPeriod === 20 ? '#4ecdc4' : 
                smaPeriod === 30 ? '#45b7d1' : '#96ceb4';

  return (
    <DetailContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Gallery
        </BackButton>
        <Title>
          <BarChart3 size={32} color={color} />
          {company?.ticker} - SMA {smaPeriod} Analysis
        </Title>
        <div></div>
      </Header>

      <ChartsContainer>
        <ChartCard>
          <YearIndicator>
            {getCurrentYearDisplay()}
          </YearIndicator>
          <TimeRangeSelector>
            <TimeRangeTitle>Time Range</TimeRangeTitle>
            <TimeRangeInputs>
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => handleDateRangeChange(e.target.value, endDate)}
              />
              <span style={{ color: '#cccccc' }}>to</span>
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => handleDateRangeChange(startDate, e.target.value)}
              />
            </TimeRangeInputs>
            <PresetButtons>
              <PresetButton onClick={() => handlePresetRange('1year')}>1 Year</PresetButton>
              <PresetButton onClick={() => handlePresetRange('2years')}>2 Years</PresetButton>
              <PresetButton onClick={() => handlePresetRange('5years')}>5 Years</PresetButton>
              <PresetButton onClick={() => handlePresetRange('all')}>All Data</PresetButton>
            </PresetButtons>
          </TimeRangeSelector>
          <ChartTitle>
            <TrendingUp size={24} color={color} />
            Price vs SMA {smaPeriod}
          </ChartTitle>
          <ScrollContainer 
            ref={priceChartRef}
            onScroll={() => handleScroll(priceChartRef, percentageChartRef)}
          >
            <ScrollIndicator>
              {filteredData.length} data points
            </ScrollIndicator>
            <ScaleIndicator>
              Price: ${priceScale.min.toFixed(2)} - ${priceScale.max.toFixed(2)}
            </ScaleIndicator>
            <ChartWrapper minWidth={`${Math.max(filteredData.length * 4, 1200)}px`}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#cccccc' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#cccccc"
                />
                <YAxis 
                  yAxisId="price"
                  orientation="left"
                  tick={{ fontSize: 12, fill: '#cccccc' }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  stroke="#cccccc"
                  domain={[priceScale.min, priceScale.max]}
                />
                <Tooltip content={<SynchronizedTooltip />} />
                <Line 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="price" 
                  stroke="#ffffff" 
                  strokeWidth={4}
                  dot={false}
                  name="Price"
                  strokeOpacity={0.9}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="sma" 
                  stroke={color} 
                  strokeWidth={4}
                  dot={false}
                  name={`SMA ${smaPeriod}`}
                  strokeOpacity={0.9}
                  activeDot={{ r: 6, fill: color, stroke: color, strokeWidth: 2 }}
                />
              </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </ScrollContainer>
          <ScrollControls>
            <ScrollButton onClick={() => navigateYear('prev')} disabled={availableYears.indexOf(currentYear) === 0}>
              <ChevronLeft size={16} />
              Previous Year
            </ScrollButton>
            <ScrollButton onClick={() => navigateYear('next')} disabled={availableYears.indexOf(currentYear) === availableYears.length - 1}>
              Next Year
              <ChevronRight size={16} />
            </ScrollButton>
          </ScrollControls>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <TrendingDown size={24} color="#ff6b6b" />
            Percentage Difference: (Price - SMA) / SMA × 100%
          </ChartTitle>
          <ScrollContainer 
            ref={percentageChartRef}
            onScroll={() => handleScroll(percentageChartRef, priceChartRef)}
          >
            <ScrollIndicator>
              {filteredData.length} data points
            </ScrollIndicator>
            <ScaleIndicator>
              % Diff: {percentageScale.min.toFixed(1)}% - {percentageScale.max.toFixed(1)}%
            </ScaleIndicator>
            <ChartWrapper minWidth={`${Math.max(filteredData.length * 4, 1200)}px`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#cccccc' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#cccccc"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#cccccc' }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                  stroke="#cccccc"
                  domain={[percentageScale.min, percentageScale.max]}
                />
                <Tooltip content={<SynchronizedTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="percentageDiff" 
                  stroke="#ff6b6b" 
                  fill="#ff6b6b"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: '#ff6b6b', stroke: '#ff6b6b', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 0} 
                  stroke="#666" 
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </ScrollContainer>
        </ChartCard>
      </ChartsContainer>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#4caf50">
            <DollarSign size={24} />
          </StatIcon>
          <StatLabel>Current Price</StatLabel>
          <StatValue>${stats.currentPrice?.toFixed(2) || 'N/A'}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color={color}>
            <BarChart3 size={24} />
          </StatIcon>
          <StatLabel>Current SMA {smaPeriod}</StatLabel>
          <StatValue>${stats.currentSMA?.toFixed(2) || 'N/A'}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color={stats.currentDiff >= 0 ? '#4caf50' : '#f44336'}>
            <TrendingUp size={24} />
          </StatIcon>
          <StatLabel>Current Difference</StatLabel>
          <StatValue>{stats.currentDiff >= 0 ? '+' : ''}{stats.currentDiff?.toFixed(2) || 'N/A'}%</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#2196f3">
            <Calendar size={24} />
          </StatIcon>
          <StatLabel>Days Above SMA</StatLabel>
          <StatValue>{((stats.daysAbove / stats.totalDays) * 100)?.toFixed(1) || 'N/A'}%</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#ff9800">
            <TrendingUp size={24} />
          </StatIcon>
          <StatLabel>Average Difference</StatLabel>
          <StatValue>{stats.avgDiff?.toFixed(2) || 'N/A'}%</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#4caf50">
            <TrendingUp size={24} />
          </StatIcon>
          <StatLabel>Maximum Difference</StatLabel>
          <StatValue>+{stats.maxDiff?.toFixed(2) || 'N/A'}%</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#f44336">
            <TrendingDown size={24} />
          </StatIcon>
          <StatLabel>Minimum Difference</StatLabel>
          <StatValue>{stats.minDiff?.toFixed(2) || 'N/A'}%</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#9c27b0">
            <Calendar size={24} />
          </StatIcon>
          <StatLabel>Total Data Points</StatLabel>
          <StatValue>{stats.totalDays || 'N/A'}</StatValue>
        </StatCard>
      </StatsGrid>
    </DetailContainer>
  );
};

export default SMADetailView;
