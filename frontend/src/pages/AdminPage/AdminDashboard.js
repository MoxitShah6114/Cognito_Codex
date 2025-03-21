import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Grid, Card, CardContent, Button } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 124,
    activeRides: 15,
    totalBikes: 50,
    activeBikes: 35,
    totalRevenue: 45670,
    totalPenalties: 12
  };

  const renderDashboardStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} lg={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{stats.totalUsers}</Typography>
            <Typography variant="body2" color="text.secondary">Registered Users</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ElectricBikeIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5">{stats.totalBikes}</Typography>
            <Typography variant="body2" color="text.secondary">Total Bikes ({stats.activeBikes} active)</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h5">₹{stats.totalRevenue}</Typography>
            <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ReportProblemIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5">{stats.totalPenalties}</Typography>
            <Typography variant="body2" color="text.secondary">Active Penalties</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <Box>
            {renderDashboardStats()}
            <Typography variant="h6" gutterBottom>Active Rides</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography>Currently there are {stats.activeRides} active rides.</Typography>
              <Button variant="contained" sx={{ mt: 2 }}>View Details</Button>
            </Paper>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>User Management</Typography>
            <Paper sx={{ p: 2 }}>
              <Typography>User list and management interface would appear here.</Typography>
            </Paper>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Bike Management</Typography>
            <Paper sx={{ p: 2 }}>
              <Typography>Bike inventory and management interface would appear here.</Typography>
            </Paper>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Damage Reports</Typography>
            <Paper sx={{ p: 2 }}>
              <Typography>Damage reports and assessment interface would appear here.</Typography>
            </Paper>
          </Box>
        );
      default:
        return <Typography>Unknown tab</Typography>;
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Users" />
          <Tab label="Bikes" />
          <Tab label="Damage Reports" />
          <Tab label="Payments" />
          <Tab label="Penalties" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>
      
      {renderContent()}
    </Box>
  );
};

export default AdminDashboard;