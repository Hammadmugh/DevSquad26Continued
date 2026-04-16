'use client';

import { Box, Typography, Button, Divider, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const handleGoogleLogin = () => {
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
      <Box sx={{ position: 'absolute', width: 300, height: 300, right: '10%', top: '10%', background: 'rgba(115,253,170,0.4)', filter: 'blur(80px)', borderRadius: '50%' }} />
      <Box sx={{ position: 'absolute', width: 250, height: 250, left: '5%', bottom: '15%', background: 'rgba(115,253,170,0.3)', filter: 'blur(80px)', borderRadius: '50%' }} />

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
          Welcome Back
        </Typography>
        <Typography sx={{ color: '#808080', textAlign: 'center', mb: 4, fontFamily: 'Montserrat', fontSize: 15 }}>
          Sign in to manage your blockchain assets
        </Typography>

        {/* Google SSO Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            bgcolor: '#fff',
            color: '#010010',
            fontWeight: 700,
            fontFamily: 'Montserrat',
            fontSize: 16,
            py: 1.75,
            borderRadius: '20px',
            '&:hover': { bgcolor: '#f0f0f0' },
            mb: 3,
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
          <Typography sx={{ color: '#808080', fontSize: 13, px: 1 }}>or</Typography>
        </Divider>

        {/* Feature highlights */}
        {[
          { emoji: '🔐', text: 'Secure Google OAuth 2.0 authentication' },
          { emoji: '⚡', text: 'Instant access to your crypto portfolio' },
          { emoji: '🌐', text: 'Trade tokens anytime, anywhere' },
        ].map((item) => (
          <Box key={item.text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Typography sx={{ fontSize: 18 }}>{item.emoji}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Montserrat' }}>
              {item.text}
            </Typography>
          </Box>
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography sx={{ color: '#808080', fontSize: 14, fontFamily: 'Montserrat' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#73FDAA', fontWeight: 700, textDecoration: 'none' }}>
              Sign up
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
