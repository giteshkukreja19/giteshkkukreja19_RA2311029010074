import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
      <Typography variant="h1" fontWeight={900} color="primary.main" fontSize={{ xs: '5rem', sm: '8rem' }}>
        404
      </Typography>
      <Typography variant="h5" fontWeight={600} color="text.secondary">
        Page not found
      </Typography>
      <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;
