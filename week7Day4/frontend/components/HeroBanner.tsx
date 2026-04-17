'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <Box>
      {/* ───── Top banner: dark left + collage right ───── */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: { xs: 'auto', md: 300 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left dark panel */}
        <Box
          sx={{
            flex: { xs: 'none', md: '0 0 50%' },
            bgcolor: '#111',
            backgroundImage: 'url(/desktop-herosection.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            p: { xs: '24px 20px', md: '50px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontStyle: 'italic',
              fontWeight: 900,
              fontSize: { xs: 22, md: 40 },
              color: '#fff',
            }}
          >
            WE ARE NEVER DONE
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontWeight: 900,
              fontSize: { xs: 11, md: 20 },
              color: '#fff',
              maxWidth: 559,
            }}
          >
            Celebrating 50 years of Nike from May 16th! Exclusive products, experiences and much more await you for
            five days. Scan and join the Nike app!
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 0.5,
              bgcolor: '#fff',
              color: '#000',
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: { xs: 12, md: 16 },
              borderRadius: 4,
              px: 3,
              py: 1,
              width: 'fit-content',
              '&:hover': { bgcolor: '#eee' },
            }}
          >
            Celebrate with us
          </Button>
        </Box>

        {/* Right collage panel */}
        <Box
          sx={{
            flex: { xs: 'none', md: '0 0 50%' },
            position: 'relative',
            height: { xs: 180, md: 'auto' },
          }}
        >
          <Image
            src="/mobile-hero.png"
            alt="Nike collage"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
      </Box>

      {/* ───── Ticker bar ───── */}
      <Box
        sx={{
          bgcolor: '#000',
          color: '#fff',
          py: 0.9,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            animation: 'ticker 20s linear infinite',
            fontFamily: 'Montserrat',
            fontSize: { xs: 11, md: 13 },
            letterSpacing: '0.15em',
            '@keyframes ticker': {
              '0%': { transform: 'translateX(10%)' },
              '100%': { transform: 'translateX(-100%)' },
            },
          }}
        >
          JUST DO IT ✓ &nbsp;&nbsp; JUST DO IT ✓ &nbsp;&nbsp; JUST DO IT ✓ &nbsp;&nbsp; JUST DO IT ✓
          &nbsp;&nbsp; JUST DO IT ✓ &nbsp;&nbsp; JUST DO IT ✓ &nbsp;&nbsp; JUST DO IT ✓ &nbsp;&nbsp; JUST
          DO IT ✓ &nbsp;&nbsp;
        </Box>
      </Box>

      {/* ───── Nike large hero (blurred backdrop) ───── */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, md: 700 },
        }}
      >
        <Image
          src="/second-desktop-herosection.png"
          alt="Nike hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* subtle blur overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(196,196,196,0.15)',
            backdropFilter: 'blur(2px)',
          }}
        />
        {/* Centered Nike swoosh */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: { xs: 80, md: 180 },
              height: { xs: 50, md: 110 },
              position: 'relative',
              filter: 'brightness(0) invert(1)',
            }}
          >
            <Image src="/brand.png" alt="Nike" fill style={{ objectFit: 'contain' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
