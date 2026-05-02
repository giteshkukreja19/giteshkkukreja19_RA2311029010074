/**
 * PrioritySection Component
 * ─────────────────────────
 * Displays top-N notifications sorted by priority.
 * Priority: Placement (3) > Result (2) > Event (1) then newer first.
 * Allows user to control how many top notifications to show (10/15/20).
 */

import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationList from './NotificationList';
import { usePriorityNotifications } from '../hooks/usePriorityNotifications';
import { logger } from '../middleware/logger';

const TOP_N_OPTIONS = [10, 15, 20, 25];

const PrioritySection: React.FC = () => {
  const {
    notifications,
    isLoading,
    error,
    topN,
    setTopN,
    handleMarkRead,
    refresh,
  } = usePriorityNotifications();

  const handleTopNChange = useCallback(
    (n: number) => {
      logger.info('component', `PrioritySection: user changed topN to ${n}`);
      setTopN(n);
    },
    [setTopN]
  );

  const handleRefresh = useCallback(() => {
    logger.info('component', 'PrioritySection: manual refresh triggered by user');
    refresh();
  }, [refresh]);

  // Stats
  const placementCount = notifications.filter((n) => n.Type === 'Placement').length;
  const resultCount    = notifications.filter((n) => n.Type === 'Result').length;
  const eventCount     = notifications.filter((n) => n.Type === 'Event').length;

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        mb={2}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 26 }} />
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Priority Inbox
            </Typography>
            <Tooltip
              title="Notifications ranked by importance: Placement → Result → Event, then newest first."
              placement="top"
            >
              <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled', cursor: 'help' }} />
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Your most important notifications, always on top
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Type breakdown chips */}
      {!isLoading && notifications.length > 0 && (
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
          {placementCount > 0 && (
            <Chip
              label={`${placementCount} Placement`}
              size="small"
              sx={{ bgcolor: '#1B5E20', color: '#fff', fontWeight: 600, fontSize: '0.72rem' }}
            />
          )}
          {resultCount > 0 && (
            <Chip
              label={`${resultCount} Result`}
              size="small"
              sx={{ bgcolor: '#E65100', color: '#fff', fontWeight: 600, fontSize: '0.72rem' }}
            />
          )}
          {eventCount > 0 && (
            <Chip
              label={`${eventCount} Event`}
              size="small"
              sx={{ bgcolor: '#01579B', color: '#fff', fontWeight: 600, fontSize: '0.72rem' }}
            />
          )}
        </Stack>
      )}

      {/* Top-N selector */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Show top:
        </Typography>
        {TOP_N_OPTIONS.map((n) => (
          <Chip
            key={n}
            label={n}
            size="small"
            onClick={() => handleTopNChange(n)}
            variant={topN === n ? 'filled' : 'outlined'}
            color={topN === n ? 'primary' : 'default'}
            sx={{
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.72rem',
              minWidth: 36,
            }}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Priority legend */}
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: '#FFF8E1',
          border: '1px solid #FFD54F',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Priority order:
        </Typography>
        {[
          { label: '💼 Placement', color: '#1B5E20', weight: 'Highest' },
          { label: '📊 Result',    color: '#E65100', weight: 'Medium'  },
          { label: '🎓 Event',     color: '#01579B', weight: 'Lower'   },
        ].map((item) => (
          <Box key={item.label} display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" sx={{ color: item.color, fontWeight: 600 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
        <Typography variant="caption" color="text.disabled">
          · Newer notifications ranked higher within same type
        </Typography>
      </Box>

      {/* Notification list */}
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        error={error}
        filterType="All"
        onMarkRead={handleMarkRead}
        onRetry={handleRefresh}
        showPriorityBadge
        skeletonCount={topN > 10 ? 8 : 5}
      />
    </Box>
  );
};

export default PrioritySection;
