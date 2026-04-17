'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

export default function NikeMembership() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 200, md: 324 },
        backgroundImage: 'url(/nike-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 4,
        px: { xs: 2, md: '50px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Montserrat',
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: { xs: 28, md: 40 },
          color: '#fff',
          maxWidth: 308,
          lineHeight: 1.2,
        }}
      >
        YOUR NIKE MEMBERSHIP
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Montserrat',
          fontWeight: 400,
          fontSize: { xs: 14, md: 20 },
          color: '#fff',
          maxWidth: 446,
        }}
      >
        Join our members and show your love with Nike By You!
      </Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: '#fff',
          color: '#000',
          fontFamily: 'Montserrat',
          fontSize: 16,
          borderRadius: 4,
          px: 3,
          py: 1,
          width: 150,
          '&:hover': { bgcolor: '#eee' },
        }}
      >
        Join Us
      </Button>
    </Box>
  );
}
