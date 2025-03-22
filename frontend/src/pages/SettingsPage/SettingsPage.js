// src/pages/SettingsPage/SettingsPage.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Switch, 
  FormControlLabel, 
  CircularProgress, 
  Divider, 
  Avatar, 
  IconButton, 
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HelpIcon from '@mui/icons-material/Help';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import DeleteIcon from '@mui/icons-material/Delete';

// Sample user data - would come from API in a real app
const userData = {
  name: 'Test User',
  email: 'mshah@sapbasesolutions.com',
  phone: '+91 9876543210',
  profilePicture: null,
  language: 'English',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  darkMode: false
};

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setNotificationSettings(userData.notifications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call to update profile
    setTimeout(() => {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notifications: notificationSettings
      });
      
      setSaving(false);
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        severity: 'success'
      });
    }, 1500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }
    
    setSaving(true);
    
    // Simulate API call to update password
    setTimeout(() => {
      setSaving(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSnackbar({
        open: true,
        message: 'Password updated successfully',
        severity: 'success'
      });
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUploadClick = () => {
    // Trigger file input click
    document.getElementById('profile-picture-upload').click();
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({
          ...user,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Settings
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7} lg={8} order={{ xs: 2, md: 1 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    type="submit" 
                    disabled={saving}
                    sx={{ mt: 2 }}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                    sx={{ mt: 2 }}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Update Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications" 
                  secondary="Receive ride updates and promotions via email" 
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={notificationSettings.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Push Notifications" 
                  secondary="Receive real-time updates on your device" 
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={notificationSettings.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="SMS Notifications" 
                  secondary="Receive important updates via SMS" 
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={notificationSettings.sms}
                    onChange={() => handleNotificationChange('sms')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Notification Settings'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5} lg={4} order={{ xs: 1, md: 2 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 10, 
                    right: 0,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                  onClick={handleUploadClick}
                >
                  <PhotoCamera />
                </IconButton>
                <input
                  type="file"
                  id="profile-picture-upload"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phone}
              </Typography>
              
              <Button 
                startIcon={<EditIcon />} 
                sx={{ mt: 2 }} 
                variant="outlined"
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" gutterBottom>
              App Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText primary="Language" secondary={user.language} />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PrivacyTipIcon />
                </ListItemIcon>
                <ListItemText primary="Privacy Settings" />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              fullWidth
            >
              Delete Account
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
  open={snackbar.open} 
  autoHideDuration={6000} 
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
    {snackbar.message}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default SettingsPage;
