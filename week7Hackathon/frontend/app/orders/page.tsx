'use client';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetOrdersQuery } from '@/lib/store/api/ordersApi';

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">Failed to load orders.</Alert>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Order History
      </Typography>

      {orders.length === 0 && (
        <Alert severity="info">No orders yet. Complete a sale from the POS page.</Alert>
      )}

      {orders.map((order) => (
        <Accordion key={order._id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Order #{order._id.slice(-6).toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={order.status}
                  color={order.status === 'completed' ? 'success' : 'default'}
                  size="small"
                />
                <Typography sx={{ fontWeight: 700 }} color="primary">
                  PKR {order.totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">PKR {item.unitPrice}</TableCell>
                      <TableCell align="right">PKR {item.subtotal.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 700 }} color="primary">
                        PKR {order.totalAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {order.note && (
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Note: {order.note}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
