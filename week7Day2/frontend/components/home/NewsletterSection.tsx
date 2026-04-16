'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useSubscribeMutation } from '../../store/api/newsletterApi';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribe, { isLoading, isSuccess, isError, error, reset }] = useSubscribeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await subscribe({ email });
  };

  const errorMessage =
    (error as any)?.data?.message || (error as any)?.error || 'Something went wrong. Please try again.';

  return (
    <Box
      id="newsletter"
      sx={{
        bgcolor: '#010010',
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: '70px' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            maxWidth: 1019,
            width: '100%',
            bgcolor: 'rgba(1,0,16,0.61)',
            borderRadius: '10px',
            boxShadow: '5px 1px 13px 4px rgba(115,253,170,0.48)',
            backdropFilter: 'blur(2.5px)',
            py: { xs: 5, md: 7 },
            px: { xs: 3, md: 6 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'Montserrat',
              fontSize: { xs: 22, md: 30, lg: 36 },
              mb: 4,
            }}
          >
            Want to be aware of all update
          </Typography>

          {isSuccess ? (
            <Alert severity="success" sx={{ maxWidth: 600, mx: 'auto', bgcolor: 'rgba(115,253,170,0.15)', color: '#73FDAA', border: '1px solid #73FDAA' }}>
              🎉 You&apos;ve successfully subscribed! Check your email for a confirmation.
            </Alert>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                maxWidth: 760,
                mx: 'auto',
                alignItems: 'stretch',
              }}
            >
              <TextField
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (isError) reset(); }}
                required
                fullWidth
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: '10px',
                    border: '3px solid #73FDAA',
                    '& fieldset': { border: 'none' },
                    '& input': { color: '#010010', fontFamily: 'Montserrat', py: 1.75 },
                    '& input::placeholder': { color: '#666' },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  bgcolor: '#73FDAA',
                  color: '#010010',
                  fontWeight: 700,
                  fontFamily: 'Montserrat',
                  fontSize: 16,
                  px: { xs: 4, md: 5 },
                  py: 1.75,
                  borderRadius: '20px',
                  minWidth: 140,
                  '&:hover': { bgcolor: '#BBFFFF' },
                  '&:disabled': { bgcolor: 'rgba(115,253,170,0.5)', color: '#010010' },
                  whiteSpace: 'nowrap',
                }}
              >
                {isLoading ? <CircularProgress size={20} sx={{ color: '#010010' }} /> : 'Subscribe'}
              </Button>
            </Box>
          )}

          {isError && (
            <Alert severity="error" sx={{ mt: 2, maxWidth: 600, mx: 'auto', bgcolor: 'rgba(255,80,80,0.1)', border: '1px solid #ff5050', color: '#ff8080' }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}
