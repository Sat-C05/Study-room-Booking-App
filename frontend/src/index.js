import React, { Suspense } from 'react'; // 1. Import Suspense
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import './i18n'; // Your translation config file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap everything in a Suspense component */}
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);