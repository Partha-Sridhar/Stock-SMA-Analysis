import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

const GraphContainer = styled.div`
  background: rgba(15, 15, 15, 0.8);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 100vh;
  position: relative;
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
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const Title = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

const TimeRangeSelector = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(15, 15, 15, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(20px);
  z-index: 100;
  min-width: 240px;
  max-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  transform: translateY(0);
`;

const TimeRangeTitle = styled.h4`
  color: #ffffff;
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
`;

const TimeRangeInputs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 12px;
`;

const PresetButton = styled.button`
  padding: 8px 10px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 6px;
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 400;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const YearSelector = styled.div`
  margin-bottom: 12px;
`;

const YearLabel = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
`;

const YearSelect = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(20, 20, 20, 0.8);
  color: #ffffff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(25, 25, 25, 0.9);
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const DateInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: rgba(20, 20, 20, 0.8);
  color: #ffffff;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(25, 25, 25, 0.9);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const CustomRangeSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
`;

const CustomRangeTitle = styled.h5`
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  font-weight: 500;
`;

const DateInputs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SMALegend = styled.div`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(20px);
`;

const LegendTitle = styled.h3`
  color: #ffffff;
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SMAList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SMAButton = styled.button`
  padding: 10px 16px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  font-weight: 300;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: visible;
  width: 100%;
  height: 500px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  
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
`;

const ChartWrapper = styled.div`
  min-width: ${props => props.minWidth || '1200px'};
  height: 100%;
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
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
  bottom: 50px;
  left: 10px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 5px;
  padding: 5px 10px;
  color: #667eea;
  font-size: 0.8rem;
  z-index: 10;
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

const SMAGraph = ({ company, data, onBack }) => {
  const [selectedSMAs, setSelectedSMAs] = useState([10, 20, 30]);
  const [currentYear, setCurrentYear] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const priceChartRef = useRef(null);
  const percentageChartRef = useRef(null);

  const availableSMAs = [10, 20, 30, 40, 50, 100];
  const smaColors = {
    10: '#ff4757',  // Bright Red
    20: '#2ed573',  // Bright Green
    30: '#1e90ff',  // Bright Blue
    40: '#ffa502',  // Bright Orange
    50: '#ff6348',  // Bright Coral
    100: '#9c88ff'  // Bright Purple
  };

  const processedData = useMemo(() => {
    if (!data) return [];
    
    return data
      .filter(item => {
        // Check if at least one selected SMA has data
        return selectedSMAs.some(sma => item[`SMA_${sma}`] !== null);
      })
      .map(item => {
        const result = {
          date: new Date(item.Date),
          price: parseFloat(item.Adjusted_Close)
        };
        
        // Add selected SMAs
        selectedSMAs.forEach(sma => {
          const smaValue = item[`SMA_${sma}`] ? parseFloat(item[`SMA_${sma}`]) : null;
          result[`sma${sma}`] = smaValue;
          
          // Calculate percentage difference
          if (smaValue !== null) {
            result[`diff${sma}`] = ((result.price - smaValue) / smaValue) * 100;
          } else {
            result[`diff${sma}`] = null;
          }
        });
        
        return result;
      });
  }, [data, selectedSMAs]);

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
    
    return processedData;
  }, [processedData, startDate, endDate]);

  // Calculate dynamic Y-axis scale for price chart
  const priceScale = useMemo(() => {
    if (!filteredData.length) return { min: 0, max: 100 };
    
    const prices = filteredData.map(d => d.price);
    const smaValues = [];
    selectedSMAs.forEach(sma => {
      filteredData.forEach(d => {
        if (d[`sma${sma}`] !== null) {
          smaValues.push(d[`sma${sma}`]);
        }
      });
    });
    
    const allValues = [...prices, ...smaValues];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    const padding = (max - min) * 0.05;
    
    return {
      min: Math.max(0, min - padding),
      max: max + padding
    };
  }, [filteredData, selectedSMAs]);

  // Calculate dynamic Y-axis scale for percentage chart
  const percentageScale = useMemo(() => {
    if (!filteredData.length) return { min: -10, max: 10 };
    
    const percentages = [];
    selectedSMAs.forEach(sma => {
      filteredData.forEach(d => {
        if (d[`diff${sma}`] !== null) {
          percentages.push(d[`diff${sma}`]);
        }
      });
    });
    
    if (percentages.length === 0) return { min: -10, max: 10 };
    
    const min = Math.min(...percentages);
    const max = Math.max(...percentages);
    
    const padding = Math.max(Math.abs(min), Math.abs(max)) * 0.1;
    
    return {
      min: min - padding,
      max: max + padding
    };
  }, [filteredData, selectedSMAs]);

  // Handle SMA selection
  const toggleSMA = (sma) => {
    setSelectedSMAs(prev => 
      prev.includes(sma) 
        ? prev.filter(s => s !== sma)
        : [...prev, sma].sort((a, b) => a - b)
    );
  };

  // Handle synchronized hover
  const handleSynchronizedHover = (data, index) => {
    setActiveIndex(index);
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

  // Custom tooltip for price chart with difference values
  const PriceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.date).toLocaleDateString();
      
      return (
        <div style={{
          background: 'rgba(15, 15, 15, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
          minWidth: '200px',
          maxWidth: '300px',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 2000
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>
            {date}
          </div>
          <div style={{ marginBottom: '8px', color: '#ffffff', fontSize: '1.1rem' }}>
            <strong>Price:</strong> ${data.price.toFixed(2)}
          </div>
          {selectedSMAs.map(sma => {
            const value = data[`sma${sma}`];
            const diff = data[`diff${sma}`];
            if (value !== null) {
              return (
                <div key={sma} style={{ marginBottom: '6px' }}>
                  <div style={{ color: smaColors[sma], fontWeight: '600' }}>
                    <strong>SMA {sma}:</strong> ${value.toFixed(2)}
                  </div>
                  <div style={{ 
                    color: diff >= 0 ? '#2ed573' : '#ff4757',
                    fontSize: '0.9rem',
                    marginLeft: '10px'
                  }}>
                    <strong>Diff:</strong> {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for percentage chart with synchronized data
  const PercentageTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.date).toLocaleDateString();
      
      return (
        <div style={{
          background: 'rgba(15, 15, 15, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
          minWidth: '200px',
          maxWidth: '300px',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 2000
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#ffffff' }}>
            {date}
          </div>
          <div style={{ marginBottom: '8px', color: '#ffffff', fontSize: '1.1rem' }}>
            <strong>Price:</strong> ${data.price.toFixed(2)}
          </div>
          {selectedSMAs.map(sma => {
            const value = data[`sma${sma}`];
            const diff = data[`diff${sma}`];
            if (diff !== null) {
              return (
                <div key={sma} style={{ marginBottom: '6px' }}>
                  <div style={{ color: smaColors[sma], fontWeight: '600' }}>
                    <strong>SMA {sma}:</strong> ${value ? value.toFixed(2) : 'N/A'}
                  </div>
                  <div style={{ 
                    color: diff >= 0 ? '#2ed573' : '#ff4757',
                    fontSize: '0.9rem',
                    marginLeft: '10px',
                    fontWeight: '600'
                  }}>
                    <strong>Diff:</strong> {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <GraphContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Search
        </BackButton>
        <Title>
          <BarChart3 size={32} color="#667eea" />
          {company?.ticker} - SMA Analysis
        </Title>
        <div></div>
      </Header>

      
      <TimeRangeSelector>
        <TimeRangeTitle>📅 Time Range</TimeRangeTitle>
        
        <YearSelector>
          <YearLabel>Select Year</YearLabel>
          <YearSelect 
            value={currentYear || ''} 
            onChange={(e) => {
              const year = e.target.value;
              if (year) {
                const yearStart = `${year}-01-01`;
                const yearEnd = `${year}-12-31`;
                handleDateRangeChange(yearStart, yearEnd);
              }
            }}
          >
            <option value="">Choose a year...</option>
            {Array.from({ length: 25 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </YearSelect>
        </YearSelector>

        <PresetButtons>
          <PresetButton onClick={() => handlePresetRange('1year')}>1 Year</PresetButton>
          <PresetButton onClick={() => handlePresetRange('2years')}>2 Years</PresetButton>
          <PresetButton onClick={() => handlePresetRange('5years')}>5 Years</PresetButton>
          <PresetButton onClick={() => handlePresetRange('all')}>All Data</PresetButton>
        </PresetButtons>

        <CustomRangeSection>
          <CustomRangeTitle>Custom Range</CustomRangeTitle>
          <DateInputs>
            <DateInput
              type="date"
              value={startDate}
              onChange={(e) => handleDateRangeChange(e.target.value, endDate)}
              placeholder="Start Date"
            />
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => handleDateRangeChange(startDate, e.target.value)}
              placeholder="End Date"
            />
          </DateInputs>
          <ApplyButton 
            onClick={() => {
              if (startDate && endDate) {
                handleDateRangeChange(startDate, endDate);
              }
            }}
            disabled={!startDate || !endDate}
          >
            Apply Custom Range
          </ApplyButton>
        </CustomRangeSection>
      </TimeRangeSelector>

      <SMALegend>
        <LegendTitle>Select SMAs to Display</LegendTitle>
        <SMAList>
          {availableSMAs.map(sma => (
            <SMAButton
              key={sma}
              active={selectedSMAs.includes(sma)}
              onClick={() => toggleSMA(sma)}
              style={{ borderColor: smaColors[sma] }}
            >
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: smaColors[sma], 
                  borderRadius: '50%' 
                }} 
              />
              SMA {sma}
            </SMAButton>
          ))}
        </SMAList>
      </SMALegend>

      <div style={{ 
        color: '#ffffff', 
        fontSize: '1.2rem', 
        fontWeight: '700', 
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
      }}>
        <DollarSign size={24} color="#ffffff" />
        Price vs SMA Analysis
      </div>

                  <ScrollContainer 
                    ref={priceChartRef}
                    onScroll={() => handleScroll(priceChartRef, percentageChartRef)}
                  >
                    <ScrollIndicator>
                      {filteredData.length} data points
                    </ScrollIndicator>
                    <ChartWrapper minWidth={`${Math.max(filteredData.length * 4, 1200)}px`}>
                      <ChartContainer>
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart 
                            data={filteredData}
                            syncId="smaCharts"
                            onMouseMove={(data, index) => handleSynchronizedHover(data, index)}
                          >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#cccccc' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                stroke="#cccccc"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#cccccc' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                stroke="#cccccc"
                domain={[priceScale.min, priceScale.max]}
              />
                            <Tooltip content={<PriceTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#ffffff" 
                strokeWidth={4}
                dot={false}
                name="Price"
                strokeOpacity={0.9}
                activeDot={{ r: 8, fill: '#ffffff', stroke: '#ffffff', strokeWidth: 3 }}
              />
              
              {selectedSMAs.map(sma => (
                <Line 
                  key={sma}
                  type="monotone" 
                  dataKey={`sma${sma}`} 
                  stroke={smaColors[sma]} 
                  strokeWidth={4}
                  dot={false}
                  name={`SMA ${sma}`}
                  strokeOpacity={0.9}
                  activeDot={{ r: 8, fill: smaColors[sma], stroke: smaColors[sma], strokeWidth: 3 }}
                />
              ))}
            </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartWrapper>
      </ScrollContainer>

      {/* Percentage Difference Chart */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ 
          color: '#ffffff', 
          fontSize: '1.2rem', 
          fontWeight: '700', 
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          <TrendingUp size={24} color="#ff6b6b" />
          Percentage Differences: (Price - SMA) / SMA × 100%
        </div>
        
                    <ScrollContainer 
                      ref={percentageChartRef}
                      onScroll={() => handleScroll(percentageChartRef, priceChartRef)}
                    >
                      <ScrollIndicator>
                        {filteredData.length} data points
                      </ScrollIndicator>
                      <ChartWrapper minWidth={`${Math.max(filteredData.length * 4, 1200)}px`}>
                        <ChartContainer>
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart 
                              data={filteredData}
                              syncId="smaCharts"
                              onMouseMove={(data, index) => handleSynchronizedHover(data, index)}
                            >
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
                              <Tooltip content={<PercentageTooltip />} />
                
                {/* Zero line */}
                <Line 
                  type="monotone" 
                  dataKey={() => 0} 
                  stroke="#666" 
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                />
                
                {/* Percentage difference lines for each SMA */}
                {selectedSMAs.map(sma => (
                  <Line 
                    key={sma}
                    type="monotone" 
                    dataKey={`diff${sma}`} 
                    stroke={smaColors[sma]} 
                    strokeWidth={4}
                    dot={false}
                    name={`SMA ${sma} Diff`}
                    strokeOpacity={0.9}
                    activeDot={{ r: 8, fill: smaColors[sma], stroke: smaColors[sma], strokeWidth: 3 }}
                  />
                ))}
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartWrapper>
        </ScrollContainer>
      </div>
    </GraphContainer>
  );
};

export default SMAGraph;
