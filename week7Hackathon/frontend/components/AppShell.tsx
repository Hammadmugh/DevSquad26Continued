'use client';
import { useState, ReactNode } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Badge,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';

const DRAWER_WIDTH = 256;

const navItems = [
  { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { label: 'Raw Materials', href: '/raw-materials', icon: <InventoryIcon /> },
  { label: 'Products', href: '/products', icon: <StorefrontIcon /> },
  { label: 'POS', href: '/pos', icon: <PointOfSaleIcon /> },
  { label: 'Orders', href: '/orders', icon: <ReceiptLongIcon /> },
];

const SIDEBAR_BG = 'linear-gradient(180deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)';

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const drawer = (
    <Box sx={{ height: '100%', background: SIDEBAR_BG, display: 'flex', flexDirection: 'column' }}>
      {/* Logo area */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 40, height: 40 }}>
          <StoreMallDirectoryIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ color: '#fff', lineHeight: 1.1, fontWeight: 800 }}>
            POS System
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
            Inventory & Sales
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />

      <Box sx={{ px: 1, py: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', px: 2, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          Navigation
        </Typography>
      </Box>

      <List sx={{ px: 1, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => { router.push(item.href); setMobileOpen(false); }}
                sx={{
                  borderRadius: '10px',
                  mx: 0,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  backdropFilter: isActive ? 'blur(8px)' : 'none',
                  border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                  '&.Mui-selected': {
                    background: 'rgba(255,255,255,0.15)',
                    '&:hover': { background: 'rgba(255,255,255,0.2)' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontWeight: isActive ? 700 : 500, fontSize: 14 } } }}
                />
                {isActive && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#a5b4fc' }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom brand */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', display: 'block', textAlign: 'center' }}>
          v1.0 · Production POS
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226,232,240,0.8)',
          color: '#1e293b',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#6366f1' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, color: '#1e293b' }}>
            POS &amp; Inventory System
          </Typography>
          <IconButton
            onClick={() => router.push('/pos')}
            sx={{
              bgcolor: cartCount > 0 ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: '#6366f1',
              '&:hover': { bgcolor: 'rgba(99,102,241,0.15)' },
            }}
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Sidebar mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
