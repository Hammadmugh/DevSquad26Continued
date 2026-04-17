'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const categories = [
  { name: 'WORKOUT', image: '/workout.png', textSide: 'left' },
  { name: 'RUN', image: '/run.png', textSide: 'right' },
  { name: 'FOOTBALL', image: '/football.png', textSide: 'left' },
];

export default function BuyByCategory() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography
        sx={{
          fontFamily: 'Montserrat',
          fontWeight: 700,
          fontSize: { xs: 22, md: 40 },
          px: { xs: 2, md: '50px' },
          mb: 3,
        }}
      >
        Buy by category
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {categories.map((cat) => (
          <Box
            key={cat.name}
            sx={{
              display: 'flex',
              flexDirection: cat.textSide === 'left' ? 'row' : 'row-reverse',
              width: '100%',
              height: { xs: 200, md: 570 },
            }}
          >
            {/* Text side */}
            <Box
              sx={{
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fff',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Montserrat',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  fontSize: { xs: 20, md: 36 },
                  letterSpacing: '0.3em',
                  color: '#000',
                }}
              >
                {cat.name}
              </Typography>
            </Box>

            {/* Image side */}
            <Box sx={{ width: '50%', position: 'relative', overflow: 'hidden' }}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

