/**
 * Priority Page
 * ─────────────
 * Displays priority-sorted notifications.
 * Placement > Result > Event, newer first.
 */

import React, { useEffect } from 'react';
import { Container, Paper, Box } from '@mui/material';
import PrioritySection from '../components/PrioritySection';
import { logger } from '../middleware/logger';

const PriorityPage: React.FC = () => {
  useEffect(() => {
    logger.info('page', 'PriorityPage mounted — priority inbox loaded');
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Paper elevation={2} sx={{ borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <PrioritySection />
      </Paper>
    </Container>
  );
};

export default PriorityPage;
