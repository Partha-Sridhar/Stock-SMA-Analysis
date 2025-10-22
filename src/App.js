import React, { useState } from 'react';
import styled from 'styled-components';
import CompanySearch from './components/CompanySearch';
import SMAGraph from './components/SMAGraph';
import { GlobalStyle } from './styles/GlobalStyle';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  padding: 0;
`;

const Header = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  margin: 8px 0 0 0;
  font-weight: 500;
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCompanyData(company.data);
  };

  const handleBackToSearch = () => {
    setSelectedCompany(null);
    setCompanyData(null);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>📈 SMA Dashboard</Title>
          <Subtitle>Interactive Simple Moving Average Analysis</Subtitle>
        </Header>
        
        <MainContent>
          {!selectedCompany ? (
            <CompanySearch onCompanySelect={handleCompanySelect} />
          ) : (
            <SMAGraph
              company={selectedCompany}
              data={companyData}
              onBack={handleBackToSearch}
            />
          )}
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;
