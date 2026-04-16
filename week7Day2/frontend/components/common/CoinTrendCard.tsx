'use client';

import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';

export interface CoinData {
  symbol: string;
  name: string;
  fullName: string;
  price: string;
  change: string;
  isPositive: boolean;
  bgColor: string;
  iconText: string;
  hasBorder: boolean;
  tagBg: string;
  tagColor: string;
}

export default function CoinTrendCard({ coin }: { coin: CoinData }) {
  return (
    <Card
      sx={{
        bgcolor: '#010010',
        border: coin.hasBorder ? '1px solid #fff' : '1px solid #010010',
        boxShadow: '0px 1px 6px 4px rgba(115, 253, 170, 0.89)',
        borderRadius: '18px',
        minHeight: 160,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 24px 4px rgba(115,253,170,0.7)' },
      }}
    >
      <CardContent sx={{ p: '18px 20px 18px 19px !important', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Coin Info Row */}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Icon + Name + Tag */}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
            {/* Coin Icon */}
            <Box sx={{ width: 50, height: 50, bgcolor: coin.bgColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 8px ${coin.bgColor}55` }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Raleway' }}>{coin.iconText}</Typography>
            </Box>
            {/* Symbol */}
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 18, fontFamily: 'Raleway' }}>{coin.symbol}</Typography>
            {/* Full name tag */}
            <Box sx={{ px: 0.75, py: 0.25, bgcolor: coin.tagBg, borderRadius: '4px', minWidth: 48 }}>
              <Typography sx={{ color: coin.tagColor, fontWeight: 600, fontSize: 10, fontFamily: 'Raleway', textAlign: 'center' }}>{coin.fullName}</Typography>
            </Box>
          </Box>

          {/* Arrow icon */}
          <Box sx={{ width: 34, height: 34, bgcolor: 'rgba(1,0,16,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NorthEastIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />

        {/* Coin Value Row */}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Price + Change */}
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 22, fontFamily: 'Roboto', lineHeight: 1.2 }}>
              {coin.price}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {coin.isPositive ? (
                <NorthEastIcon sx={{ color: '#73FDAA', fontSize: 14 }} />
              ) : (
                <SouthEastIcon sx={{ color: '#808080', fontSize: 14 }} />
              )}
              <Typography sx={{ color: coin.isPositive ? '#fff' : '#808080', fontWeight: 500, fontSize: 16, fontFamily: 'Roboto' }}>
                {coin.change}
              </Typography>
            </Box>
          </Box>

          {/* Mini sparkline chart */}
          <Box sx={{ width: 90, height: 48, display: 'flex', alignItems: 'flex-end' }}>
            <svg width="90" height="48" viewBox="0 0 90 48">
              <polyline
                points={coin.isPositive ? '0,40 15,32 30,35 45,20 60,25 75,12 90,8' : '0,12 15,20 30,18 45,30 60,28 75,36 90,40'}
                fill="none"
                stroke={coin.isPositive ? '#73FDAA' : '#808080'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
