/**
 * App Root
 * ────────
 * Sets up MUI theme, routing, and auth guard.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './styles/theme';
import AppHeader from './components/AppHeader';
import AuthGuard from './components/AuthGuard';
import DashboardPage from './pages/DashboardPage';
import PriorityPage from './pages/PriorityPage';
import NotFoundPage from './pages/NotFoundPage';
import { logger } from './middleware/logger';

// Log app startup
logger.info('page', 'Campus Notification System initialised');

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AppHeader />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/priority" element={<PriorityPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AuthGuard>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
