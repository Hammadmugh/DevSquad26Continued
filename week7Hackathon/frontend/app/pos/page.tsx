'use client';
import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Snackbar,
  Avatar,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useGetProductsQuery } from '@/lib/store/api/productsApi';
import { useCreateOrderMutation } from '@/lib/store/api/ordersApi';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addToCart,
  incrementItem,
  decrementItem,
  removeFromCart,
  clearCart,
} from '@/lib/store/slices/cartSlice';

export default function POSPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { data: products = [], isLoading, isError, refetch } = useGetProductsQuery();
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    const inCart = cartItems.find((i) => i.product._id === productId)?.quantity ?? 0;
    if (inCart >= product.availableQuantity) {
      setErrorMsg(`Max available: ${product.availableQuantity} of "${product.name}"`);
      return;
    }
    dispatch(addToCart(product));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) { setErrorMsg('Cart is empty'); return; }
    try {
      await createOrder({
        items: cartItems.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        note,
      }).unwrap();
      dispatch(clearCart());
      setNote('');
      setSuccessMsg('Order placed successfully!');
      refetch();
    } catch (e: any) {
      const msg = e?.data?.message;
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg || 'Order failed');
    }
  };

  if (isLoading)
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#6366f1' }} /></Box>;
  if (isError) return <Alert severity="error">Failed to load products.</Alert>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>Point of Sale</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>Select products and complete the sale</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Products Grid */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.secondary" mb={1.5} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12 }}>
            Available Products
          </Typography>
          <Grid container spacing={2}>
            {products.map((p) => {
              const available = p.availableQuantity > 0;
              const inCart = cartItems.find((i) => i.product._id === p._id)?.quantity ?? 0;
              return (
                <Grid key={p._id} size={{ xs: 6, sm: 4 }}>
                  <Card
                    sx={{
                      opacity: available ? 1 : 0.5,
                      transition: 'all 0.2s ease',
                      border: inCart > 0 ? '2px solid #6366f1' : '1px solid rgba(226,232,240,0.8)',
                      '&:hover': available ? { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(99,102,241,0.15)' } : {},
                    }}
                  >
                    <CardActionArea onClick={() => available && handleAddToCart(p._id)} disabled={!available} sx={{ borderRadius: 'inherit' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            {p.name}
                          </Typography>
                          {inCart > 0 && (
                            <Avatar sx={{ width: 22, height: 22, bgcolor: '#6366f1', fontSize: 11, fontWeight: 700 }}>
                              {inCart}
                            </Avatar>
                          )}
                        </Box>
                        <Typography variant="h6" fontWeight={800} sx={{ color: '#6366f1', mb: 1 }}>
                          PKR {p.price.toLocaleString()}
                        </Typography>
                        <Chip
                          label={available ? `${p.availableQuantity} left` : 'Out of Stock'}
                          size="small"
                          sx={{
                            fontSize: 10, fontWeight: 700,
                            bgcolor: available ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: available ? '#059669' : '#dc2626',
                          }}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Cart Panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ border: '1px solid rgba(226,232,240,0.8)', borderRadius: 3, position: 'sticky', top: 80, overflow: 'hidden' }}>
            {/* Cart Header */}
            <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShoppingCartIcon sx={{ color: '#fff' }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', flexGrow: 1 }}>
                Current Order
              </Typography>
              {cartItems.length > 0 && (
                <Chip label={`${cartItems.reduce((s, i) => s + i.quantity, 0)} items`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
              )}
            </Box>

            <Box sx={{ p: 2.5 }}>
              {cartItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <AddShoppingCartIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">Cart is empty</Typography>
                  <Typography color="text.secondary" variant="caption">Click a product to add it</Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
                    {cartItems.map((item) => (
                      <Box key={item.product._id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>{item.product.name}</Typography>
                          <Typography variant="caption" color="text.secondary">PKR {item.product.price} each</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => dispatch(decrementItem(item.product._id))} sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', width: 26, height: 26 }}>
                            <RemoveIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                          <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 800, fontSize: 15 }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => {
                            if (item.quantity >= item.product.availableQuantity) { setErrorMsg(`Max: ${item.product.availableQuantity}`); return; }
                            dispatch(incrementItem(item.product._id));
                          }} sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', width: 26, height: 26 }}>
                            <AddIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: 64 }}>
                          <Typography variant="body2" fontWeight={700} color="#6366f1">
                            PKR {(item.product.price * item.quantity).toLocaleString()}
                          </Typography>
                        </Box>
                        <IconButton size="small" color="error" onClick={() => dispatch(removeFromCart(item.product._id))} sx={{ ml: 0.5 }}>
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.5, bgcolor: 'rgba(99,102,241,0.06)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: '#6366f1' }}>
                      PKR {total.toLocaleString()}
                    </Typography>
                  </Box>

                  <TextField
                    label="Order Note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth size="small" multiline rows={2}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<PointOfSaleIcon />}
                    onClick={handleCheckout}
                    disabled={isOrdering}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      py: 1.5,
                      fontSize: 16,
                      fontWeight: 700,
                      '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
                    }}
                  >
                    {isOrdering ? 'Processing...' : 'Complete Sale'}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ borderRadius: 2 }}>{successMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={5000} onClose={() => setErrorMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ borderRadius: 2 }}>{errorMsg}</Alert>
      </Snackbar>
    </Box>
  );
}
