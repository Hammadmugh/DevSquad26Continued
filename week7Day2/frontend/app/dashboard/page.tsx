'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Paper, Avatar, Button, Divider, CircularProgress, Alert
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CoinTrendCard, { CoinData } from '../../components/common/CoinTrendCard';
import { useAppSelector } from '../../store/hooks';
import { useGetProfileQuery } from '../../store/api/usersApi';

const portfolioCoins: CoinData[] = [
  { symbol: 'BTC', name: 'BTC', fullName: 'BITCOIN', price: '$56,623.54', change: '1.41%', isPositive: true, bgColor: '#F7931A', iconText: '₿', hasBorder: true, tagBg: '#010010', tagColor: '#fff' },
  { symbol: 'ETH', name: 'ETH', fullName: 'ETHEREUM', price: '$4,267.90', change: '2.22%', isPositive: true, bgColor: '#627EEA', iconText: 'Ξ', hasBorder: false, tagBg: '#fff', tagColor: '#fff' },
  { symbol: 'BNB', name: 'BNB', fullName: 'BINANCE', price: '$587.74', change: '0.82%', isPositive: false, bgColor: '#F3BA2F', iconText: 'B', hasBorder: true, tagBg: 'rgba(182,182,182,0.3)', tagColor: '#fff' },
  { symbol: 'USDT', name: 'USDT', fullName: 'TETHER', price: '$0.9998', change: '0,03%', isPositive: true, bgColor: '#26A17B', iconText: '₮', hasBorder: true, tagBg: 'rgba(182,182,182,0.3)', tagColor: '#fff' },
];

const stats = [
  { icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#73FDAA' }} />, label: 'Total Balance', value: '$62,479.16' },
  { icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#73FDAA' }} />, label: '24h P&L', value: '+$1,342.80' },
  { icon: <SwapHorizIcon sx={{ fontSize: 32, color: '#73FDAA' }} />, label: 'Total Trades', value: '148' },
];

export default function DashboardPage() {
  const router = useRouter();
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
      <Box sx={{ pt: 12, pb: 6, px: { xs: 3, md: '70px' }, maxWidth: 1440, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', mb: 0.5 }}>
              Dashboard
            </Typography>
            {isLoading ? (
              <CircularProgress size={16} sx={{ color: '#73FDAA' }} />
            ) : profile ? (
              <Typography sx={{ color: '#73FDAA', fontFamily: 'Montserrat', fontSize: 16 }}>
                Welcome back, {profile.name}!
              </Typography>
            ) : isError ? (
              <Alert severity="error" sx={{ bgcolor: 'transparent', color: '#ff8080', p: 0, fontSize: 14 }}>
                Could not load profile. Check your connection.
              </Alert>
            ) : null}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ bgcolor: '#73FDAA', color: '#010010', fontWeight: 700, borderRadius: '20px', px: 3 }}>
              Connect Wallet
            </Button>
            <Button variant="outlined" sx={{ borderColor: '#73FDAA', color: '#73FDAA', fontWeight: 700, borderRadius: '20px', px: 3 }}>
              Start Trading
            </Button>
          </Box>
        </Box>

        {/* Stats row */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
              <Paper sx={{ bgcolor: '#010010', border: '1px solid rgba(115,253,170,0.3)', borderRadius: '16px', p: 3, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 16px rgba(115,253,170,0.15)' }}>
                {stat.icon}
                <Box>
                  <Typography sx={{ color: '#808080', fontSize: 13, fontFamily: 'Montserrat' }}>{stat.label}</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'Roboto' }}>{stat.value}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Profile Card (if loaded) */}
        {profile && (
          <Paper sx={{ bgcolor: '#010010', border: '1px solid rgba(115,253,170,0.3)', borderRadius: '16px', p: 3, mb: 5, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar src={profile.picture} sx={{ width: 64, height: 64, bgcolor: '#73FDAA', color: '#010010', fontWeight: 700, fontSize: 24 }}>
              {profile.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20, fontFamily: 'Montserrat' }}>{profile.name}</Typography>
              <Typography sx={{ color: '#808080', fontSize: 15, fontFamily: 'Montserrat' }}>{profile.email}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Montserrat', mt: 0.5 }}>
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        )}

        <Divider sx={{ borderColor: 'rgba(115,253,170,0.2)', mb: 5 }} />

        {/* Market Trend */}
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Montserrat', mb: 3 }}>
          Market Overview
        </Typography>
        <Grid container spacing={2}>
          {portfolioCoins.map((coin) => (
            <Grid key={coin.symbol} size={{ xs: 12, sm: 6, md: 3 }}>
              <CoinTrendCard coin={coin} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}
