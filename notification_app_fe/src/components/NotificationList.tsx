/**
 * NotificationList Component
 * ──────────────────────────
 * Renders a list of NotificationCards with loading skeletons,
 * empty state, and error state handling.
 */

import React from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationCard from './NotificationCard';
import type { Notification } from '../types';
import { logger } from '../middleware/logger';

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const CardSkeleton: React.FC = () => (
  <Box sx={{ mb: 1.5, p: 2, borderRadius: 2, bgcolor: 'white', border: '1px solid #E0E7EF' }}>
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Skeleton variant="rounded" width={90} height={24} />
      <Skeleton variant="circular" width={28} height={28} />
    </Box>
    <Skeleton variant="text" width="90%" height={20} />
    <Skeleton variant="text" width="65%" height={20} />
    <Skeleton variant="text" width={160} height={16} sx={{ mt: 0.5 }} />
  </Box>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ filterType: string }> = ({ filterType }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={8}
    gap={2}
  >
    <NotificationsOffIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
    <Typography variant="h6" color="text.secondary" fontWeight={500}>
      No notifications found
    </Typography>
    <Typography variant="body2" color="text.disabled" textAlign="center">
      {filterType === 'All'
        ? 'There are no notifications at the moment.'
        : `No ${filterType} notifications available.`}
    </Typography>
  </Box>
);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  filterType: string;
  onMarkRead: (id: string) => void;
  onRetry: () => void;
  showPriorityBadge?: boolean;
  skeletonCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  error,
  filterType,
  onMarkRead,
  onRetry,
  showPriorityBadge = false,
  skeletonCount = 5,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Box>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    logger.warn('component', `NotificationList: displaying error state — ${error}`);
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Retry
          </Button>
        }
        sx={{ my: 2 }}
      >
        <Typography variant="body2" fontWeight={600}>
          Failed to load notifications
        </Typography>
        <Typography variant="caption">{error}</Typography>
      </Alert>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return <EmptyState filterType={filterType} />;
  }

  // Notifications list
  return (
    <Stack spacing={0}>
      {notifications.map((notification, index) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          onMarkRead={onMarkRead}
          showPriorityBadge={showPriorityBadge}
          rank={showPriorityBadge ? index + 1 : undefined}
        />
      ))}
    </Stack>
  );
};

export default React.memo(NotificationList);
