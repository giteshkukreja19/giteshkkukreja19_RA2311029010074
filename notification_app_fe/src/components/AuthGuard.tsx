/**
 * AuthGuard Component
 * ───────────────────
 * Wraps pages that require authentication.
 * Shows loading spinner while auth is pending, error state if auth fails.
 */

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error, retry } = useAuth();

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Connecting to notification service…
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Authenticating your session
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        p={3}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 440, width: '100%', textAlign: 'center', borderRadius: 3 }}
        >
          <LockIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Authentication Failed
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={retry}
            fullWidth
          >
            Retry Connection
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default AuthGuard;
