'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Avatar, Button, Paper, Grid, Divider, CircularProgress, Alert, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GoogleIcon from '@mui/icons-material/Google';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useGetProfileQuery } from '../../store/api/usersApi';
import { logout } from '../../store/slices/authSlice';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: profile, isLoading, isError } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cc_token') : null;
    if (!isAuthenticated && !token) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#010010', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#73FDAA' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#010010', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ pt: 12, pb: 8, px: { xs: 3, md: '70px' }, maxWidth: 1440, mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', mb: 5 }}>
          My Profile
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#73FDAA' }} size={48} />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ bgcolor: 'rgba(255,80,80,0.1)', color: '#ff8080', border: '1px solid #ff5050', borderRadius: '12px' }}>
            Failed to load profile. Please try again.
          </Alert>
        )}

        {profile && (
          <Grid container spacing={4}>
            {/* Left card: Avatar + name */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ bgcolor: '#010010', border: '1px solid rgba(115,253,170,0.3)', borderRadius: '20px', p: 4, textAlign: 'center', boxShadow: '0 4px 24px rgba(115,253,170,0.1)' }}>
                <Avatar
                  src={profile.picture}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#73FDAA', color: '#010010', fontSize: 36, fontWeight: 700, boxShadow: '0 0 30px rgba(115,253,170,0.4)' }}
                >
                  {profile.name?.[0]?.toUpperCase()}
                </Avatar>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'Montserrat', mb: 0.5 }}>
                  {profile.name}
                </Typography>
                <Chip
                  icon={<GoogleIcon sx={{ fontSize: 14, color: '#73FDAA !important' }} />}
                  label="Google Account"
                  size="small"
                  sx={{ bgcolor: 'rgba(115,253,170,0.1)', color: '#73FDAA', border: '1px solid rgba(115,253,170,0.3)', fontFamily: 'Montserrat', mt: 1 }}
                />
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ borderColor: '#73FDAA', color: '#73FDAA', borderRadius: '20px', fontWeight: 700, fontFamily: 'Montserrat', mb: 2 }}
                >
                  Edit Profile
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => { dispatch(logout()); router.push('/'); }}
                  sx={{ borderColor: 'rgba(255,80,80,0.5)', color: '#ff8080', borderRadius: '20px', fontWeight: 700, fontFamily: 'Montserrat' }}
                >
                  Sign Out
                </Button>
              </Paper>
            </Grid>

            {/* Right card: Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ bgcolor: '#010010', border: '1px solid rgba(115,253,170,0.3)', borderRadius: '20px', p: 4, boxShadow: '0 4px 24px rgba(115,253,170,0.1)' }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', fontSize: 18, mb: 3 }}>
                  Account Information
                </Typography>

                {[
                  { icon: <EmailIcon sx={{ color: '#73FDAA' }} />, label: 'Email Address', value: profile.email },
                  { icon: <GoogleIcon sx={{ color: '#73FDAA' }} />, label: 'Google ID', value: profile.googleId },
                  { icon: <CalendarTodayIcon sx={{ color: '#73FDAA' }} />, label: 'Member Since', value: new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map((field) => (
                  <Box key={field.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Box sx={{ width: 44, height: 44, bgcolor: 'rgba(115,253,170,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {field.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#808080', fontSize: 13, fontFamily: 'Montserrat', mb: 0.25 }}>
                        {field.label}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 500, fontFamily: 'Montserrat', fontSize: 16, wordBreak: 'break-all' }}>
                        {field.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

                <Typography sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', fontSize: 18, mb: 3 }}>
                  Preferences
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {['Email Notifications', 'Market Alerts', 'Newsletter'].map((pref) => (
                    <Chip
                      key={pref}
                      label={pref}
                      sx={{ bgcolor: 'rgba(115,253,170,0.1)', color: '#73FDAA', border: '1px solid rgba(115,253,170,0.3)', fontFamily: 'Montserrat' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      <Footer />
    </Box>
  );
}
