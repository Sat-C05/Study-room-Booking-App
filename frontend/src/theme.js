import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // A strong, professional blue for main actions
      main: '#1976d2', 
    },
    secondary: {
      // A clear red for destructive actions like delete
      main: '#d32f2f', 
    },
    // Our new accent color for highlights and visual interest
    accent: {
      main: '#00796b', // The deep teal you liked
      contrastText: '#ffffff',
    },
    navbar: {
      main: '#0d47a1', // The deep blue for the top bar
    },
    background: {
      // A very light grey for the page background
      default: '#f4f6f8',
      // Pure white for cards and paper elements to make them stand out
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // Dark grey for primary text for readability
      secondary: '#757575', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
});

export default theme;