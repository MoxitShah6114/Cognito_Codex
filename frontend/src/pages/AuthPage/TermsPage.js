import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ my: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. User Registration and Eligibility
        </Typography>
        <Typography variant="body1" paragraph>
          Users must be at least 18 years old and possess a valid driving license to register for our EV Bike Rental service. 
          You agree to provide accurate, current, and complete information during the registration process and to update such 
          information to keep it accurate, current, and complete.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          2. Document Verification
        </Typography>
        <Typography variant="body1" paragraph>
          All users must verify their identity through DigiLocker. We require a valid government ID and driving license. 
          These documents will be verified before you can rent an EV bike.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          3. Bike Usage Rules
        </Typography>
        <Typography variant="body1" paragraph>
          • Helmets must be worn at all times while riding the EV bikes.
          • Users must follow all traffic laws and regulations.
          • EV bikes must be parked only in designated areas, as shown in the app.
          • The EV bike can be used only by the registered user, not by any third party.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          4. Penalties and Damages
        </Typography>
        <Typography variant="body1" paragraph>
          Users will be held liable for any damages caused to the EV bike during their rental period. 
          Additional charges will apply for:
          • Late returns
          • Improper parking
          • Damages to the EV bike
          • Traffic violations
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          5. Payment Terms
        </Typography>
        <Typography variant="body1" paragraph>
          Users agree to pay all fees and charges incurred in connection with their use of the EV bike at the rates in 
          effect when the charges were incurred. Users will be charged via the payment method provided during registration.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          6. Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We collect and process your personal data in accordance with our Privacy Policy. By using our service, 
          you consent to such processing and you warrant that all data provided by you is accurate.
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          7. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to terminate or suspend your account and refuse any and all current or future use of the 
          service for violations of these terms or any other reason at our sole discretion.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            I Accept & Return
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TermsPage;
