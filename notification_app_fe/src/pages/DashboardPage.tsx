/**
 * Dashboard Page
 * ──────────────
 * Main notifications page with filter, pagination, and read/unread tracking.
 */

import React, { useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterBar from '../components/FilterBar';
import NotificationList from '../components/NotificationList';
import Pagination from '../components/Pagination';
import { useNotifications } from '../hooks/useNotifications';
import { logger } from '../middleware/logger';
import type { FilterValue } from '../components/FilterBar';

const DashboardPage: React.FC = () => {
  const {
    notifications,
    isLoading,
    error,
    filter,
    hasNextPage,
    hasPrevPage,
    setFilter,
    handleMarkRead,
    refresh,
  } = useNotifications();

  useEffect(() => {
    logger.info('page', 'DashboardPage mounted — notifications dashboard loaded');
  }, []);

  const handleFilterChange = useCallback(
    (value: FilterValue) => {
      setFilter({ notificationType: value });
    },
    [setFilter]
  );

  const handleNext = useCallback(() => {
    setFilter({ page: filter.page + 1 });
  }, [filter.page, setFilter]);

  const handlePrev = useCallback(() => {
    setFilter({ page: Math.max(1, filter.page - 1) });
  }, [filter.page, setFilter]);

  const handleLimitChange = useCallback(
    (limit: number) => {
      setFilter({ limit, page: 1 });
    },
    [setFilter]
  );

  const handleRefresh = useCallback(() => {
    logger.info('page', 'DashboardPage: user triggered manual refresh');
    refresh();
  }, [refresh]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Page header */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Badge>
            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary" lineHeight={1.2}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All campus updates in one place
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} unread`}
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            )}
            <Tooltip title="Refresh notifications">
              <IconButton onClick={handleRefresh} disabled={isLoading} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Stats strip */}
      {!isLoading && notifications.length > 0 && (
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
          {['Placement', 'Result', 'Event'].map((type) => {
            const count = notifications.filter((n) => n.Type === type).length;
            if (count === 0) return null;
            const colors: Record<string, string> = {
              Placement: '#1B5E20',
              Result: '#E65100',
              Event: '#01579B',
            };
            return (
              <Chip
                key={type}
                label={`${count} ${type}`}
                size="small"
                sx={{ bgcolor: colors[type], color: '#fff', fontWeight: 600, fontSize: '0.72rem' }}
              />
            );
          })}
        </Stack>
      )}

      {/* Main content card */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Filter section */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 2, bgcolor: '#FAFBFF' }}>
          <FilterBar
            value={filter.notificationType}
            onChange={handleFilterChange}
            totalCount={notifications.length}
          />
        </Box>

        <Divider />

        {/* Notifications */}
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            error={error}
            filterType={filter.notificationType}
            onMarkRead={handleMarkRead}
            onRetry={handleRefresh}
            skeletonCount={filter.limit}
          />
        </Box>

        {/* Pagination */}
        {!error && (
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2.5 }}>
            <Pagination
              page={filter.page}
              hasNext={hasNextPage}
              hasPrev={hasPrevPage}
              isLoading={isLoading}
              onNext={handleNext}
              onPrev={handlePrev}
              limit={filter.limit}
              onLimitChange={handleLimitChange}
            />
          </Box>
        )}
      </Paper>

      {/* Footer hint */}
      <Typography
        variant="caption"
        color="text.disabled"
        display="block"
        textAlign="center"
        mt={2}
      >
        Click any notification card to mark it as read
      </Typography>
    </Container>
  );
};

export default DashboardPage;
