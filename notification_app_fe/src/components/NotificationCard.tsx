/**
 * NotificationCard Component
 * ──────────────────────────
 * Displays a single notification with type badge, message, and timestamp.
 * Supports read/unread visual distinction and click-to-read behaviour.
 */

import React, { useCallback } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { logger } from '../middleware/logger';
import { formatTimestamp, getRelativeTime } from '../utils/formatters';
import type { Notification, NotificationType } from '../types';

// ─── Sub-helpers ──────────────────────────────────────────────────────────────

function getTypeIcon(type: NotificationType): React.ReactElement {
  const iconStyle = { fontSize: 16 };
  switch (type) {
    case 'Placement': return <WorkIcon sx={iconStyle} />;
    case 'Result':    return <EmojiEventsIcon sx={iconStyle} />;
    case 'Event':     return <SchoolIcon sx={iconStyle} />;
  }
}

function getTypeChipStyle(type: NotificationType, isReadState: boolean) {
  const opacity = isReadState ? 0.65 : 1;
  switch (type) {
    case 'Placement':
      return { bgcolor: '#1B5E20', color: '#fff', opacity };
    case 'Result':
      return { bgcolor: '#E65100', color: '#fff', opacity };
    case 'Event':
      return { bgcolor: '#01579B', color: '#fff', opacity };
    default:
      return { bgcolor: '#37474F', color: '#fff', opacity };
  }
}

function getCardStyle(type: NotificationType, isReadState: boolean) {
  if (isReadState) {
    return {
      borderLeft: '4px solid #B0BEC5',
      bgcolor: '#FAFAFA',
      opacity: 0.75,
    };
  }
  const borderColors: Record<NotificationType, string> = {
    Placement: '#2E7D32',
    Result:    '#E65100',
    Event:     '#0277BD',
  };
  const bgColors: Record<NotificationType, string> = {
    Placement: '#F1F8E9',
    Result:    '#FFF8E1',
    Event:     '#E3F2FD',
  };
  return {
    borderLeft: `4px solid ${borderColors[type]}`,
    bgcolor: bgColors[type] ?? '#FFFFFF',
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  showPriorityBadge?: boolean;
  rank?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  showPriorityBadge = false,
  rank,
}) => {
  const { ID, Type, Message, Timestamp, isRead: isReadState = false } = notification;

  const handleCardClick = useCallback(() => {
    if (!isReadState) {
      logger.info('component', `User clicked notification ${ID.slice(0, 8)}... — marking as read`);
      onMarkRead(ID);
    }
  }, [ID, isReadState, onMarkRead]);

  const handleMarkReadClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isReadState) {
        logger.info('component', `User clicked mark-read button for notification ${ID.slice(0, 8)}...`);
        onMarkRead(ID);
      }
    },
    [ID, isReadState, onMarkRead]
  );

  const cardStyle = getCardStyle(Type, isReadState);

  return (
    <Fade in timeout={300}>
      <Card
        onClick={handleCardClick}
        sx={{
          cursor: isReadState ? 'default' : 'pointer',
          position: 'relative',
          mb: 1.5,
          ...cardStyle,
          transition: 'all 0.2s ease',
        }}
        elevation={isReadState ? 0 : 2}
      >
        {/* Priority rank badge */}
        {showPriorityBadge && rank !== undefined && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 48,
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: rank <= 3 ? '#FFD700' : '#E0E0E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem',
              color: rank <= 3 ? '#5D4037' : '#616161',
              boxShadow: rank <= 3 ? '0 2px 6px rgba(255,215,0,0.4)' : 'none',
            }}
          >
            #{rank}
          </Box>
        )}

        <CardContent sx={{ pb: '12px !important', pt: 1.5, px: 2 }}>
          {/* Header row: type chip + read button */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Chip
              icon={getTypeIcon(Type)}
              label={Type}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.3px',
                height: 24,
                ...getTypeChipStyle(Type, isReadState),
                '& .MuiChip-icon': { color: 'inherit' },
              }}
            />

            <Box display="flex" alignItems="center" gap={0.5}>
              {!isReadState && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                    },
                  }}
                />
              )}
              <Tooltip title={isReadState ? 'Already read' : 'Mark as read'} placement="top">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleMarkReadClick}
                    disabled={isReadState}
                    sx={{
                      color: isReadState ? 'success.main' : 'text.secondary',
                      p: 0.5,
                    }}
                  >
                    {isReadState ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <CheckCircleOutlineIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: isReadState ? 400 : 600,
              color: isReadState ? 'text.secondary' : 'text.primary',
              lineHeight: 1.5,
              mb: 1,
              fontSize: '0.95rem',
            }}
          >
            {Message}
          </Typography>

          {/* Timestamp */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontSize="0.72rem">
              {formatTimestamp(Timestamp)}
            </Typography>
            <Typography variant="caption" color="text.disabled" fontSize="0.70rem">
              · {getRelativeTime(Timestamp)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default React.memo(NotificationCard);
