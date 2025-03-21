import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SimpleMap = ({ sourceLocation, destinationLocation, children }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Map View (Placeholder)</Typography>
      <Box 
        sx={{ 
          height: 400, 
          bgcolor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          borderRadius: 1
        }}
      >
        <Typography>
          {sourceLocation && destinationLocation ? 
            `Route from ${sourceLocation} to ${destinationLocation}` : 
            'Please select locations to view the route'}
        </Typography>
        {children}
      </Box>
    </Paper>
  );
};

export default SimpleMap;