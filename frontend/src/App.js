// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './styles/App.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layout Components
import Layout from './components/common/Layout';

// Page Components
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/AuthPage/LoginPage';
import SignupPage from './pages/AuthPage/SignupPage';
import TermsPage from './pages/AuthPage/TermsPage';
import DocumentVerification from './pages/AuthPage/DocumentVerification';
import DigiLockerCallback from './pages/AuthPage/DigiLockerCallback';
import RideSelectPage from './pages/RidePage/RideSelectPage';
import RideTrackingPage from './pages/RidePage/RideTrackingPage';
import PaymentPage from './pages/PaymentPage/PaymentsPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import AdminDashboard from './pages/AdminPage/AdminDashboard';
import PaymentsPage from './pages/PaymentPage/PaymentsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import HelpSupportPage from './pages/HelpPage/HelpSupportPage';
import RideHistoryPage from './pages/RidePage/RideHistoryPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="auth/digilocker/callback" element={<DigiLockerCallback />} />
          
          <Route path="document-verification" element={
            <ProtectedRoute>
              <DocumentVerification />
            </ProtectedRoute>
          } />
          
          <Route path="ride-select" element={
            <ProtectedRoute>
              <RideSelectPage />
            </ProtectedRoute>
          } />
          
          <Route path="ride-tracking/:rideId" element={
            <ProtectedRoute>
              <RideTrackingPage />
            </ProtectedRoute>
          } />
          
          <Route path="payment/:rideId" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

<Route path="payments" element={
  <ProtectedRoute>
    <PaymentsPage />
  </ProtectedRoute>
} />

<Route path="settings" element={
  <ProtectedRoute>
    <SettingsPage />
  </ProtectedRoute>
} />

<Route path="help" element={
  <ProtectedRoute>
    <HelpSupportPage />
  </ProtectedRoute>
} />

<Route path="ride-history" element={
  <ProtectedRoute>
    <RideHistoryPage />
  </ProtectedRoute>
} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
