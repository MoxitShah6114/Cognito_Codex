import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} EV Bike Rental System. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <MuiLink color="inherit" href="/terms">
            Terms & Conditions
          </MuiLink>{' '}
          |{' '}
          <MuiLink color="inherit" href="/privacy">
            Privacy Policy
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
