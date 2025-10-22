import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #0a0a0a;
    color: #ffffff;
    font-weight: 400;
  }

  .recharts-tooltip-wrapper {
    background: rgba(15, 15, 15, 0.98) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    backdrop-filter: blur(10px) !important;
  }

  .recharts-tooltip-label {
    font-weight: 400 !important;
    color: #ffffff !important;
    font-size: 0.9rem !important;
  }

  .recharts-tooltip-item {
    color: #cccccc !important;
    font-size: 0.85rem !important;
  }
`;
