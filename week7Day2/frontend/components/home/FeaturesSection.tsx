'use client';

import Image from 'next/image';
import { Box, Typography, Grid } from '@mui/material';

const features = [
  {
    title: 'Access Token Market',
    desc: 'Buy and sell token anytime and anywhere',
  },
  {
    title: 'User Friendly Interface',
    desc: 'Easy to navigate',
  },
  {
    title: 'Ownership Token control',
    desc: 'Be in control and own as many asset as possible',
  },
];

export default function FeaturesSection() {
  return (
    <Box
      id="features"
      sx={{
        position: 'relative',
        bgcolor: '#010010',
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: '70px' },
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <Box sx={{ position: 'absolute', width: 248, height: 248, left: '15%', top: 0, background: 'rgba(115,253,170,0.56)', filter: 'blur(69.5px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'Montserrat',
              fontSize: { xs: 24, md: 36, lg: 44 },
              lineHeight: 1.3,
              maxWidth: 860,
              mx: 'auto',
              mb: 2,
            }}
          >
            Global Decentralize currency based on blockchain technology
          </Typography>
          <Typography sx={{ color: '#73FDAA', fontWeight: 500, fontFamily: 'Montserrat', fontSize: { xs: 14, md: 18 } }}>
            Web3 is the latest efficient technology
          </Typography>
        </Box>

          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          {/* Left: Illustration */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: { xs: 220, md: 460 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/steps-side.png"
                alt="Crypto wallet illustration"
                width={460}
                height={460}
                style={{ width: '100%', height: 'auto', maxWidth: 460 }}
              />
            </Box>
          </Grid>

          {/* Right: Feature cards */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {features.map((f, i) => (
                <Box
                  key={f.title}
                  sx={{
                    background: `linear-gradient(270deg, rgba(115,253,170,0.89) 0%, rgba(196,196,196,0) 100%)`,
                    borderRadius: '10px',
                    p: { xs: 2.5, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    textAlign: 'right',
                    minHeight: { xs: 80, md: 100 },
                    justifyContent: 'center',
                    opacity: 0.9 + i * 0.03,
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', fontSize: { xs: 18, md: 24, lg: 28 }, mb: 0.5 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ color: '#010010', fontWeight: 500, fontFamily: 'Montserrat', fontSize: { xs: 13, md: 16 } }}>
                    {f.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
