import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // This is the only change
    primary: {
      main: '#2196f3', // Your blue theme color
    },
    secondary: {
      main: '#f44336', // Your red theme color
    },
  },
});

export default theme;