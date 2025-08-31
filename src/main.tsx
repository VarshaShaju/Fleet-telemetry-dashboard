import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "./i18n";


// Initialize mock data for development
if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
  import('./services/mockData').then(({ initializeMockData }) => {
    initializeMockData();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
