'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SignupPage() {
  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#010010',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* Glow effects */}
      <Box sx={{ position: 'absolute', width: 300, height: 300, left: '10%', top: '15%', background: 'rgba(115,253,170,0.4)', filter: 'blur(80px)', borderRadius: '50%' }} />
      <Box sx={{ position: 'absolute', width: 250, height: 250, right: '5%', bottom: '10%', background: 'rgba(115,253,170,0.3)', filter: 'blur(80px)', borderRadius: '50%' }} />

      <Paper
        elevation={0}
        sx={{
          bgcolor: '#010010',
          border: '1px solid rgba(115,253,170,0.3)',
          borderRadius: '20px',
          p: { xs: 4, md: 6 },
          maxWidth: 460,
          width: '100%',
          boxShadow: '0px 4px 24px rgba(115,253,170,0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: 40, height: 40, mr: 1.5 }}>
            {[{ top: 0, left: 0 }, { top: 0, left: 22 }, { top: 22, left: 0 }, { top: 22, left: 22 }].map((pos, i) => (
              <Box key={i} sx={{ position: 'absolute', width: 13, height: 13, bgcolor: '#fff', borderRadius: '50%', ...pos }} />
            ))}
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 24, fontFamily: 'Montserrat' }}>
            Circlechain
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', textAlign: 'center', mb: 1, fontSize: { xs: 24, md: 30 } }}>
          Create Account
        </Typography>
        <Typography sx={{ color: '#808080', textAlign: 'center', mb: 4, fontFamily: 'Montserrat', fontSize: 15 }}>
          Start managing your blockchain assets today
        </Typography>

        {/* Steps */}
        {[
          { step: '1', title: 'Connect Google', desc: 'Use your existing Google account' },
          { step: '2', title: 'Get Verified', desc: 'Instant identity verification' },
          { step: '3', title: 'Start Trading', desc: 'Access full crypto market' },
        ].map((s) => (
          <Box key={s.step} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <Box sx={{ width: 36, height: 36, bgcolor: 'rgba(115,253,170,0.15)', border: '1px solid #73FDAA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography sx={{ color: '#73FDAA', fontWeight: 700, fontSize: 14 }}>{s.step}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Montserrat' }}>{s.title}</Typography>
              <Typography sx={{ color: '#808080', fontSize: 13, fontFamily: 'Montserrat' }}>{s.desc}</Typography>
            </Box>
          </Box>
        ))}

        {/* Google SSO Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
          sx={{
            bgcolor: '#73FDAA',
            color: '#010010',
            fontWeight: 700,
            fontFamily: 'Montserrat',
            fontSize: 16,
            py: 1.75,
            borderRadius: '20px',
            mt: 3,
            '&:hover': { bgcolor: '#BBFFFF' },
          }}
        >
          Sign up with Google
        </Button>

        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', mt: 2, fontFamily: 'Montserrat' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Typography>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography sx={{ color: '#808080', fontSize: 14, fontFamily: 'Montserrat' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#73FDAA', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', fontFamily: 'Montserrat' }}>
            ← Back to home
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
