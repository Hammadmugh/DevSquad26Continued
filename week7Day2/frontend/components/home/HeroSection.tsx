'use client';

import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: '#010010',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 12, md: 10 },
        px: { xs: 3, md: '70px' },
      }}
    >
      {/* Glow blobs */}
      <Box sx={{ position: 'absolute', width: 248, height: 248, right: { xs: -60, md: 100 }, top: 100, background: 'rgba(115,253,170,0.69)', filter: 'blur(69.5px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 248, height: 248, left: { xs: -80, md: 0 }, top: 60, background: 'rgba(115,253,170,0.5)', filter: 'blur(69.5px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Box sx={{ maxWidth: 1440, mx: 'auto', width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
        {/* Text content */}
        <Box sx={{ flex: 1, zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'Montserrat',
              fontSize: { xs: 38, sm: 52, md: 68, lg: 75 },
              lineHeight: 1.2,
              mb: 3,
              maxWidth: 680,
            }}
          >
            Save, Buy and Sell Your blockchain asset
          </Typography>

          <Typography
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontFamily: 'Montserrat',
              fontSize: { xs: 18, md: 28, lg: 32 },
              lineHeight: 1.4,
              mb: 5,
              maxWidth: 500,
            }}
          >
            The easy to manage and trade your cryptocurency asset
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#BBFFFF',
                color: '#010010',
                fontWeight: 700,
                fontFamily: 'Montserrat',
                fontSize: 16,
                px: 4,
                py: 1.75,
                borderRadius: '20px',
                '&:hover': { bgcolor: '#73FDAA' },
              }}
            >
              Connect Wallet
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              sx={{
                bgcolor: '#fff',
                color: '#010010',
                fontWeight: 700,
                fontFamily: 'Montserrat',
                fontSize: 16,
                px: 4,
                py: 1.75,
                borderRadius: '20px',
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              Start Trading
            </Button>
          </Box>
        </Box>

        {/* Hero illustration — stylised 3D crypto trading visual */}
        <Image src={"/hero-img.png"} alt='hero' width={540} height={540}/>
      </Box>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Box>
  );
}
