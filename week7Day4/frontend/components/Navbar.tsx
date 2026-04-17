'use client';

import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Link from 'next/link';
import { useGetCartQuery } from '@/services/cartApi';

const NAV_LEFT = ['WOMAN', 'MEN', 'ALL'];
const NAV_RIGHT = ['WORKOUT', 'RUN', 'FOOTBALL'];
const ALL_NAV = ['ALL', 'WOMAN', 'MEN', 'WORKOUT', 'RUN', 'FOOTBALL'];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: cart } = useGetCartQuery();
  const cartCount = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: '#fff', color: '#000', borderBottom: '1px solid #eee', zIndex: 999 }}
      >
        <Toolbar sx={{ height: 79, px: { xs: 2, md: '50px' }, justifyContent: 'space-between' }}>
          {/* Mobile: hamburger */}
          <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>

          {/* Desktop left nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {NAV_LEFT.map((item, i) => (
              <Typography
                key={item}
                sx={{
                  fontFamily: 'Montserrat',
                  fontSize: 18,
                  fontWeight: i === 2 ? 700 : 400,
                  cursor: 'pointer',
                  borderBottom: i === 2 ? '2px solid #000' : 'none',
                  pb: i === 2 ? '2px' : 0,
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Logo */}
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontSize: { xs: 20, md: 32 },
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#A0A0A0',
              position: { md: 'absolute' },
              left: { md: '50%' },
              transform: { md: 'translateX(-50%)' },
            }}
          >
            YOUR<b style={{ color: '#000' }}>SNEAKER</b>
          </Typography>

          {/* Right icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <IconButton sx={{ display: { xs: 'none', md: 'flex' } }}>
              <PersonIcon />
            </IconButton>
            <IconButton sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SearchIcon />
            </IconButton>
            <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
              <IconButton>
                <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10 } }}>
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: 20, color: '#A0A0A0' }}>
              YOUR<b style={{ color: '#000' }}>SNEAKER</b>
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SearchIcon sx={{ color: '#aaa' }} />
              <Typography sx={{ fontFamily: 'Montserrat', fontSize: 18, color: '#aaa', letterSpacing: '0.1em' }}>
                SEARCH
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PersonIcon sx={{ color: '#aaa' }} />
              <Typography sx={{ fontFamily: 'Montserrat', fontSize: 18, color: '#aaa', letterSpacing: '0.1em' }}>
                LOGIN
              </Typography>
            </Box>
          </Box>
          <List>
            {ALL_NAV.map((item, i) => (
              <ListItem key={item} sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Typography sx={{
                      fontFamily: 'Montserrat',
                      fontSize: 20,
                      fontWeight: i === 0 ? 700 : 400,
                      borderBottom: i === 0 ? '2px solid #000' : 'none',
                      display: 'inline-block',
                    }}>{item}</Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            {/* Nike swoosh */}
            <img src="/brand.png" alt="Nike" style={{ width: 80, opacity: 0.3 }} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
