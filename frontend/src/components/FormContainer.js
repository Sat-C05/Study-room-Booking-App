import React from 'react';
import { Box } from '@mui/material';

const FormContainer = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh',
        // Optional: Add a subtle gradient background for a more modern feel
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      {children}
    </Box>
  );
};

export default FormContainer;
