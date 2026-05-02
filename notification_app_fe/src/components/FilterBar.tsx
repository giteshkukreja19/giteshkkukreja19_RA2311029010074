/**
 * FilterBar Component
 * ───────────────────
 * Dropdown for filtering notifications by type.
 * Emits onChange with the selected filter value.
 */

import React, { useCallback } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { logger } from '../middleware/logger';
import type { NotificationType } from '../types';

export type FilterValue = NotificationType | 'All';

const FILTER_OPTIONS: { value: FilterValue; label: string; color: string }[] = [
  { value: 'All',       label: 'All Notifications',  color: '#546E7A' },
  { value: 'Placement', label: '💼 Placement',        color: '#1B5E20' },
  { value: 'Result',    label: '📊 Result',            color: '#E65100' },
  { value: 'Event',     label: '🎓 Event',             color: '#01579B' },
];

export interface FilterBarProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  totalCount?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ value, onChange, totalCount }) => {
  const handleChange = useCallback(
    (event: SelectChangeEvent<FilterValue>) => {
      const newVal = event.target.value as FilterValue;
      logger.info('component', `FilterBar: user changed filter to "${newVal}"`);
      onChange(newVal);
    },
    [onChange]
  );

  // Quick filter chips
  const handleChipClick = useCallback(
    (chipVal: FilterValue) => {
      logger.info('component', `FilterBar: quick filter chip clicked — "${chipVal}"`);
      onChange(chipVal);
    },
    [onChange]
  );

  return (
    <Box>
      {/* Main filter row */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{ mb: 1.5 }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            Filter
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="notif-type-label">Notification Type</InputLabel>
          <Select<FilterValue>
            labelId="notif-type-label"
            value={value}
            label="Notification Type"
            onChange={handleChange}
          >
            {FILTER_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Typography variant="body2" fontWeight={500}>
                  {opt.label}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {totalCount !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Showing <strong>{totalCount}</strong> notification{totalCount !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      {/* Quick filter chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {FILTER_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            size="small"
            onClick={() => handleChipClick(opt.value)}
            variant={value === opt.value ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              fontSize: '0.72rem',
              cursor: 'pointer',
              ...(value === opt.value
                ? { bgcolor: opt.color, color: '#fff', borderColor: opt.color }
                : { color: opt.color, borderColor: opt.color }),
              '&:hover': {
                bgcolor: opt.color,
                color: '#fff',
                opacity: 0.85,
              },
              transition: 'all 0.15s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default React.memo(FilterBar);
