'use client';

import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from '@/services/cartApi';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading cart...</Typography>
      </Box>
    );
  }

  const items = cart?.items ?? [];

  return (
    <Box sx={{ px: { xs: 2, md: '50px' }, py: 4, minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: { xs: 24, md: 40 } }}>
          Shopping Cart
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: 20, color: '#666', mb: 3 }}>
            Your cart is empty
          </Typography>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#000',
                color: '#fff',
                fontFamily: 'Montserrat',
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: '#333' },
              }}
            >
              Continue Shopping
            </Button>
          </Link>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1 }}>
            {items.map((item) => (
              <Paper
                key={item.productId}
                elevation={2}
                sx={{ p: 2, mb: 2, borderRadius: '18px' }}
              >
                {/* Top row: image + name + delete */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                    <Image
                      src={item.image || '/top-1.png'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: { xs: 13, md: 18 }, wordBreak: 'break-word' }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Montserrat', fontSize: 14, color: '#555' }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => removeItem(item.productId)} sx={{ color: '#ff3939', flexShrink: 0 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {/* Bottom row: qty controls + subtotal */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pl: { xs: 0, md: '96px' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateItem({ productId: item.productId, quantity: item.quantity - 1 })}
                      sx={{ bgcolor: '#f0f0f0', borderRadius: '50%' }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18, minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateItem({ productId: item.productId, quantity: item.quantity + 1 })}
                      sx={{ bgcolor: '#f0f0f0', borderRadius: '50%' }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', md: 340 } }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: '18px' }}>
              <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, mb: 2 }}>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {items.map((item) => (
                <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontFamily: 'Montserrat', fontSize: 14, color: '#555' }}>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Montserrat', fontSize: 14 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}>Total</Typography>
                <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}>
                  ${(cart?.total ?? 0).toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
}
