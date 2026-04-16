'use client';

import { Box, Typography, Grid, Link as MuiLink } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';

const quickLinks = ['How it work', 'Blog', 'Support'];
const socialIcons = [
  { icon: <FacebookIcon sx={{ fontSize: 18 }} />, href: '#' },
  { icon: <InstagramIcon sx={{ fontSize: 18 }} />, href: '#' },
  { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, href: '#' },
  { icon: <TelegramIcon sx={{ fontSize: 18 }} />, href: '#' },
];

const logoMark = (
  <Box sx={{ position: 'relative', width: 42, height: 42, mr: 1.5, flexShrink: 0 }}>
    {[{ top: 0, left: 0 }, { top: 0, left: 22 }, { top: 22, left: 0 }, { top: 22, left: 22 }].map((pos, i) => (
      <Box key={i} sx={{ position: 'absolute', width: 14, height: 14, bgcolor: '#fff', borderRadius: '50%', ...pos }} />
    ))}
    <Box sx={{ position: 'absolute', width: 20, height: 0, border: '2px solid #fff', top: 7, left: 11 }} />
    <Box sx={{ position: 'absolute', width: 0, height: 18, border: '2px solid #fff', top: 11, left: 8 }} />
    <Box sx={{ position: 'absolute', width: 21, height: 0, border: '2px solid #fff', top: 36, left: 11 }} />
    <Box sx={{ position: 'absolute', width: 0, height: 11, border: '2px solid #fff', top: 29, left: 36 }} />
  </Box>
);

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#010010',
        boxShadow: '0px -5px 4px rgba(115, 253, 170, 0.36)',
        pt: 6,
        pb: 4,
        px: { xs: 3, md: '70px' },
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {logoMark}
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 24, fontFamily: 'Montserrat' }}>
                Circlechain
              </Typography>
            </Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
              Amet minim mollit non deserunt ullamco est aliqua dolor do amet sint. Velit officia
              consequatduis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 22, md: 28 }, fontFamily: 'Montserrat', mb: 2 }}>
              Quick Link
            </Typography>
            {quickLinks.map((link) => (
              <Box key={link} sx={{ mb: 1.5 }}>
                <MuiLink href="#" underline="none" sx={{ color: '#fff', fontWeight: 500, fontSize: 16, fontFamily: 'Montserrat', '&:hover': { color: '#73FDAA' } }}>
                  {link}
                </MuiLink>
              </Box>
            ))}
          </Grid>

          {/* Social Media */}
          <Grid size={{ xs: 6, md: 5 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 22, md: 28 }, fontFamily: 'Montserrat', mb: 2 }}>
              Social Media
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {socialIcons.map((s, i) => (
                <Box key={i} component="a" href={s.href} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, border: '2.5px solid #fff', borderRadius: '5px', color: '#fff', '&:hover': { borderColor: '#73FDAA', color: '#73FDAA' }, transition: 'all 0.2s' }}>
                  {s.icon}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 5, textAlign: 'right' }}>
          <Typography sx={{ color: '#fff', fontSize: 16, fontFamily: 'Montserrat', fontWeight: 500 }}>
            (c) 2022 Circlechain
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
