'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch } from '../../../store/hooks';
import { setToken } from '../../../store/slices/authSlice';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      dispatch(setToken(token));
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [searchParams, dispatch, router]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#010010', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <CircularProgress sx={{ color: '#73FDAA' }} size={48} />
      <Typography sx={{ color: '#fff', fontFamily: 'Montserrat', fontSize: 18 }}>
        Authenticating with Google...
      </Typography>
    </Box>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', bgcolor: '#010010', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#73FDAA' }} />
      </Box>
    }>
      <CallbackContent />
    </Suspense>
  );
}
