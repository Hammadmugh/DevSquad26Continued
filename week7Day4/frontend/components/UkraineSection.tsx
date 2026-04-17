'use client';

import { Box, Typography } from '@mui/material';

export default function UkraineSection() {
  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography
        sx={{
          fontFamily: 'Montserrat',
          fontWeight: 400,
          fontSize: { xs: 16, md: 24 },
          textTransform: 'uppercase',
          color: '#000',
          mb: 2,
        }}
      >
        THANKS FOR WATCHING
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Montserrat',
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: { xs: 28, md: 48 },
          color: '#000',
          mb: 2,
        }}
      >
        Glory to Ukraine
      </Typography>
      {/* Ukrainian flag */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <img src="/ukraine-flag.png" alt="Ukraine Flag" style={{ width: 80, height: 50 }} />
      </Box>
    </Box>
  );
}
