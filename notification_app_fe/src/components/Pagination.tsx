/**
 * Pagination Component
 * ────────────────────
 * Prev / Next navigation with current page indicator.
 * Driven by page and hasNext/hasPrev flags from the hook.
 */

import React, { useCallback } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { logger } from '../middleware/logger';

export interface PaginationProps {
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  limit: number;
  onLimitChange?: (limit: number) => void;
}

const LIMIT_OPTIONS = [5, 10, 20, 50];

const Pagination: React.FC<PaginationProps> = ({
  page,
  hasNext,
  hasPrev,
  isLoading,
  onNext,
  onPrev,
  limit,
  onLimitChange,
}) => {
  const handleNext = useCallback(() => {
    logger.info('component', `Pagination: navigating to page ${page + 1}`);
    onNext();
  }, [page, onNext]);

  const handlePrev = useCallback(() => {
    logger.info('component', `Pagination: navigating to page ${page - 1}`);
    onPrev();
  }, [page, onPrev]);

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      if (onLimitChange) {
        logger.info('component', `Pagination: limit changed to ${newLimit}`);
        onLimitChange(newLimit);
      }
    },
    [onLimitChange]
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={1.5}
      sx={{
        mt: 2,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Per-page selector */}
      {onLimitChange && (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Per page:
          </Typography>
          {LIMIT_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              size="small"
              onClick={() => handleLimitChange(opt)}
              variant={limit === opt ? 'filled' : 'outlined'}
              color={limit === opt ? 'primary' : 'default'}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.72rem',
                minWidth: 32,
              }}
            />
          ))}
        </Box>
      )}

      {/* Page navigation */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.8rem !important' }} />}
          onClick={handlePrev}
          disabled={!hasPrev || isLoading}
          sx={{ minWidth: 100 }}
        >
          Previous
        </Button>

        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            minWidth: 36,
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} fontSize="0.85rem">
            {page}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.8rem !important' }} />}
          onClick={handleNext}
          disabled={!hasNext || isLoading}
          sx={{ minWidth: 80 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(Pagination);
