import { createTheme } from '@mui/material/styles';

// This is the new, professional monochromatic theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // A strong, dark charcoal for main actions and the Navbar
      main: '#212121', 
    },
    secondary: {
      // A slightly desaturated red for delete actions to match the theme
      main: '#c62828', 
    },
    // The "tint" - a cool, slate grey for accents and icons
    accent: {
      main: '#607d8b',
      contrastText: '#ffffff',
    },
    // The Navbar will now use the primary charcoal color
    navbar: {
      main: '#212121',
    },
    background: {
      // A very light, soft grey for the page background
      default: '#f5f5f5',
      // Pure white for cards to make them pop
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // Dark grey for primary text
      secondary: '#757575', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  // We can add subtle overrides to components here
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly softer corners for all cards
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Match the paper's border radius
          textTransform: 'none', // More modern button text
        },
      },
    },
  },
});

export default theme;
