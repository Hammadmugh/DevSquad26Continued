'use client';

import { Box, Typography, Grid } from '@mui/material';
import CoinTrendCard, { CoinData } from '../common/CoinTrendCard';

const coins: CoinData[] = [
  {
    symbol: 'BTC',
    name: 'BTC',
    fullName: 'BITCOIN',
    price: '$56,623.54',
    change: '1.41%',
    isPositive: true,
    bgColor: '#F7931A',
    iconText: '₿',
    hasBorder: true,
    tagBg: '#010010',
    tagColor: '#fff',
  },
  {
    symbol: 'ETH',
    name: 'ETH',
    fullName: 'ETHEREUM',
    price: '$4,267.90',
    change: '2.22%',
    isPositive: true,
    bgColor: '#627EEA',
    iconText: 'Ξ',
    hasBorder: false,
    tagBg: '#fff',
    tagColor: '#fff',
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    fullName: 'BINANCE',
    price: '$587.74',
    change: '0.82%',
    isPositive: false,
    bgColor: '#F3BA2F',
    iconText: 'B',
    hasBorder: true,
    tagBg: 'rgba(182,182,182,0.3)',
    tagColor: '#fff',
  },
  {
    symbol: 'USDT',
    name: 'USDT',
    fullName: 'TETHER',
    price: '$0.9998',
    change: '0,03%',
    isPositive: true,
    bgColor: '#26A17B',
    iconText: '₮',
    hasBorder: true,
    tagBg: 'rgba(182,182,182,0.3)',
    tagColor: '#fff',
  },
];

// 4 rows of 4 coins as shown in Figma
const rows = [coins, coins, coins, coins];

export default function MarketTrendSection() {
  return (
    <Box
      id="market"
      sx={{
        bgcolor: '#010010',
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: '70px' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow blobs */}
      <Box sx={{ position: 'absolute', width: 248, height: 248, right: 100, top: '30%', background: 'rgba(115,253,170,0.69)', filter: 'blur(69.5px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 248, height: 248, left: 80, bottom: '10%', background: 'rgba(115,253,170,0.69)', filter: 'blur(69.5px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontFamily: 'Montserrat',
            fontSize: { xs: 28, md: 40, lg: 48 },
            mb: { xs: 4, md: 5 },
          }}
        >
          Market Trend
        </Typography>

        {rows.map((row, rowIdx) => (
          <Grid container spacing={2} key={rowIdx} sx={{ mb: 2 }}>
            {row.map((coin, colIdx) => (
              <Grid key={`${rowIdx}-${colIdx}`} size={{ xs: 12, sm: 6, md: 3 }}>
                <CoinTrendCard coin={coin} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    </Box>
  );
}
