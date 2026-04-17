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
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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

  const total = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    const inCart = cartItems.find((i) => i.product._id === productId)?.quantity ?? 0;
    if (inCart >= product.availableQuantity) {
      setErrorMsg(`Cannot add more than ${product.availableQuantity} of "${product.name}"`);
      return;
    }
    dispatch(addToCart(product));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setErrorMsg('Cart is empty');
      return;
    }
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">Failed to load products.</Alert>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Point of Sale
      </Typography>

      <Grid container spacing={3}>
        {/* Products Grid */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Products
          </Typography>
          <Grid container spacing={2}>
            {products.map((p) => {
              const available = p.availableQuantity > 0;
              return (
                <Grid key={p._id} size={{ xs: 6, sm: 4 }}>
                  <Card
                    elevation={available ? 2 : 1}
                    sx={{ opacity: available ? 1 : 0.55 }}
                  >
                    <CardActionArea
                      onClick={() => available && handleAddToCart(p._id)}
                      disabled={!available}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                          {p.name}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                          PKR {p.price}
                        </Typography>
                        <Chip
                          label={available ? `${p.availableQuantity} avail.` : 'Out of Stock'}
                          color={available ? 'success' : 'error'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Cart / Order Panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={3} sx={{ p: 2, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddShoppingCartIcon /> Current Order
            </Typography>

            {cartItems.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No items added yet.
                <br />
                Click a product to add.
              </Typography>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Box
                    key={item.product._id}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, gap: 1 }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {item.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PKR {item.product.price} × {item.quantity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(decrementItem(item.product._id))}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const inCart = item.quantity;
                          if (inCart >= item.product.availableQuantity) {
                            setErrorMsg(`Max available: ${item.product.availableQuantity}`);
                            return;
                          }
                          dispatch(incrementItem(item.product._id));
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => dispatch(removeFromCart(item.product._id))}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" fontWeight={700} minWidth={60} textAlign="right">
                      PKR {(item.product.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary">
                    PKR {total.toLocaleString()}
                  </Typography>
                </Box>

                <TextField
                  label="Order Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  startIcon={<PointOfSaleIcon />}
                  onClick={handleCheckout}
                  disabled={isOrdering}
                >
                  {isOrdering ? 'Processing...' : 'Complete Sale'}
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={5000}
        onClose={() => setErrorMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
