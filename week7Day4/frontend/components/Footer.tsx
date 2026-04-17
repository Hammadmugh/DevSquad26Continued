'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const leftLinks = ['ALL', 'WOMAN', 'MEN'];
const rightLinks = ['WORKOUT', 'RUN', 'FOOTBALL'];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: '50px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: { xs: 'auto', md: 320 },
      }}
    >
      {/* Left nav */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
        {leftLinks.map((link) => (
          <Typography
            key={link}
            sx={{
              fontFamily: 'Montserrat',
              fontSize: { xs: 14, md: 18 },
              color: '#fff',
              cursor: 'pointer',
              '&:hover': { opacity: 0.7 },
            }}
          >
            {link}
          </Typography>
        ))}
      </Box>

      {/* Center logo */}
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: 120, md: 220 },
            height: { xs: 120, md: 220 },
            mx: 'auto',
          }}
        >
          <Image src="/nike-footer.png" alt="Nike Ukraine" fill style={{ objectFit: 'contain' }} />
        </Box>
      </Box>

      {/* Right nav */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, alignItems: 'flex-end' }}>
        {rightLinks.map((link) => (
          <Typography
            key={link}
            sx={{
              fontFamily: 'Montserrat',
              fontSize: { xs: 14, md: 18 },
              color: '#fff',
              cursor: 'pointer',
              '&:hover': { opacity: 0.7 },
            }}
          >
            {link}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
