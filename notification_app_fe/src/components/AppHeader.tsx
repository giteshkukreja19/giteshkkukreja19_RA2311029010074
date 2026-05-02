/**
 * AppHeader Component
 * ───────────────────
 * Top navigation bar with app title and navigation links.
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate, useLocation } from 'react-router-dom';
import { logger } from '../middleware/logger';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNav = (path: string, label: string) => {
    logger.info('component', `AppHeader: user navigating to ${label} (${path})`);
    navigate(path);
  };

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  const isPriority  = location.pathname === '/priority';

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: '#1565C0',
        backgroundImage: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
        {/* Logo + Title */}
        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
          <NotificationsActiveIcon sx={{ fontSize: 28, color: '#FFD700' }} />
          {!isMobile && (
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.1} fontSize="1rem">
                Campus Notifications
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.65rem' }}>
                Stay informed, always
              </Typography>
            </Box>
          )}
          {isMobile && (
            <Typography variant="h6" fontWeight={700} fontSize="0.95rem">
              CampusNotify
            </Typography>
          )}
        </Box>

        {/* Navigation */}
        <Box display="flex" alignItems="center" gap={0.5}>
          {isMobile ? (
            <>
              <IconButton
                onClick={() => handleNav('/dashboard', 'Dashboard')}
                sx={{ color: isDashboard ? '#FFD700' : 'rgba(255,255,255,0.75)' }}
              >
                <DashboardIcon />
              </IconButton>
              <IconButton
                onClick={() => handleNav('/priority', 'Priority')}
                sx={{ color: isPriority ? '#FFD700' : 'rgba(255,255,255,0.75)' }}
              >
                <EmojiEventsIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                startIcon={<DashboardIcon />}
                onClick={() => handleNav('/dashboard', 'Dashboard')}
                sx={{
                  color: isDashboard ? '#FFD700' : 'rgba(255,255,255,0.85)',
                  fontWeight: isDashboard ? 700 : 500,
                  borderBottom: isDashboard ? '2px solid #FFD700' : '2px solid transparent',
                  borderRadius: 0,
                  px: 1.5,
                  '&:hover': { color: '#FFD700', bgcolor: 'transparent' },
                }}
              >
                Dashboard
              </Button>
              <Button
                startIcon={<EmojiEventsIcon />}
                onClick={() => handleNav('/priority', 'Priority')}
                sx={{
                  color: isPriority ? '#FFD700' : 'rgba(255,255,255,0.85)',
                  fontWeight: isPriority ? 700 : 500,
                  borderBottom: isPriority ? '2px solid #FFD700' : '2px solid transparent',
                  borderRadius: 0,
                  px: 1.5,
                  '&:hover': { color: '#FFD700', bgcolor: 'transparent' },
                }}
              >
                Priority Inbox
              </Button>
            </>
          )}

          <Chip
            label="Live"
            size="small"
            sx={{
              ml: 1,
              bgcolor: '#4CAF50',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 20,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 },
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
