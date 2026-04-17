'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import Image from 'next/image';

const navLinks = [
  { label: 'How it work', href: '#features' },
  { label: 'Blog', href: '#' },
  { label: 'Support', href: '#' },
];

const socialIcons = [
  { icon: <FacebookIcon sx={{ fontSize: 20 }} />, href: '#' },
  { icon: <InstagramIcon sx={{ fontSize: 20 }} />, href: '#' },
  { icon: <LinkedInIcon sx={{ fontSize: 20 }} />, href: '#' },
  { icon: <TelegramIcon sx={{ fontSize: 20 }} />, href: '#' },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: 'transparent', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(115,253,170,0.1)', zIndex: 1300 }}
      >
        <Toolbar sx={{ maxWidth: 1440, width: '100%', mx: 'auto', px: { xs: 2, md: '70px' }, py: 1.5, minHeight: '80px !important' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image src={"/logo.png"} alt='logo' width={25} height={25}/>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: 20, md: 24 }, fontFamily: 'Montserrat', marginLeft:"15px" }}>
              Circlechain
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              {/* Nav Links */}
              <Box sx={{ display: 'flex', gap: 4, mr: 4 }}>
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 18, fontFamily: 'Montserrat', '&:hover': { color: '#73FDAA' }, transition: 'color 0.2s' }}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>

              {/* Social Icons */}
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                {socialIcons.map((s, i) => (
                  <Box key={i} component="a" href={s.href} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '2px solid rgba(255,255,255,0.5)', borderRadius: '6px', color: '#fff', '&:hover': { borderColor: '#73FDAA', color: '#73FDAA' }, transition: 'all 0.2s' }}>
                    {s.icon}
                  </Box>
                ))}
              </Box>

              {/* Auth */}
              {isAuthenticated ? (
                <>
                  <Button component={Link} href="/profile" variant="outlined" sx={{ borderColor: '#73FDAA', color: '#73FDAA', mr: 1, borderRadius: '20px' }}>Profile</Button>
                  <Button onClick={() => dispatch(logout())} variant="outlined" sx={{ borderColor: '#fff', color: '#fff', borderRadius: '20px' }}>Logout</Button>
                </>
              ) : (
                <Button component={Link} href="/login" variant="contained" sx={{ bgcolor: '#73FDAA', color: '#010010', '&:hover': { bgcolor: '#BBFFFF' }, borderRadius: '20px', px: 3 }}>
                  Login
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { sx: { bgcolor: '#010010', width: 260, borderLeft: '1px solid rgba(115,253,170,0.3)' } } }}>
        <Box sx={{ p: 3 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.label} component={Link} href={link.href} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={<Typography sx={{ color: '#fff', fontWeight: 500, fontFamily: 'Montserrat' }}>{link.label}</Typography>} />
              </ListItem>
            ))}
            <ListItem component={Link} href="/login" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary={<Typography sx={{ color: '#73FDAA', fontWeight: 700, fontFamily: 'Montserrat' }}>Login</Typography>} />
            </ListItem>
            {isAuthenticated && (
              <ListItem onClick={() => { dispatch(logout()); setDrawerOpen(false); }} sx={{ cursor: 'pointer' }}>
                <ListItemText primary={<Typography sx={{ color: '#fff', fontWeight: 500 }}>Logout</Typography>} />
              </ListItem>
            )}
          </List>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
            {socialIcons.map((s, i) => (
              <Box key={i} component="a" href={s.href} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '2px solid rgba(255,255,255,0.5)', borderRadius: '6px', color: '#fff' }}>
                {s.icon}
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
