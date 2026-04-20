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
  Avatar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotesIcon from '@mui/icons-material/Notes';
import { useGetOrdersQuery } from '@/lib/store/api/ordersApi';

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  if (isLoading)
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#6366f1' }} /></Box>;
  if (isError) return <Alert severity="error">Failed to load orders.</Alert>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Order History</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {orders.length} total orders placed
        </Typography>
      </Box>

      {orders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#fff', borderRadius: 3, border: '1px dashed #e2e8f0' }}>
          <ReceiptLongIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 2 }} />
          <Typography sx={{ fontWeight: 600 }} color="text.secondary">No orders yet</Typography>
          <Typography variant="body2" color="text.secondary">Complete a sale from the POS page</Typography>
        </Box>
      )}

      {orders.map((order, idx) => (
        <Accordion
          key={order._id}
          elevation={0}
          sx={{
            mb: 1.5,
            border: '1px solid rgba(226,232,240,0.8)',
            borderRadius: '12px !important',
            overflow: 'hidden',
            '&:before': { display: 'none' },
            '&.Mui-expanded': { boxShadow: '0 4px 16px rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.25)' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#6366f1' }} />}
            sx={{ px: 2.5, py: 0.5, '&:hover': { bgcolor: 'rgba(99,102,241,0.03)' } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: 13, fontWeight: 800 }}>
                  {idx + 1}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  label={order.status}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: order.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: order.status === 'completed' ? '#059669' : '#d97706',
                  }}
                />
                <Typography sx={{ fontWeight: 800, color: '#6366f1', fontSize: 15 }}>
                  PKR {order.totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, i) => (
                    <TableRow key={i} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.productName}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={item.quantity} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: '#6366f1', fontWeight: 700, minWidth: 32 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">PKR {item.unitPrice.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>PKR {item.subtotal.toLocaleString()}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: 'rgba(99,102,241,0.04)' }}>
                    <TableCell colSpan={3} align="right" sx={{ border: 0 }}>
                      <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ border: 0 }}>
                      <Typography sx={{ fontWeight: 800, color: '#6366f1', fontSize: 16 }}>
                        PKR {order.totalAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {order.note && (
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'flex-start', gap: 0.75, p: 1.5, bgcolor: '#fef9ee', borderRadius: 2, border: '1px solid #fde68a' }}>
                <NotesIcon sx={{ fontSize: 16, color: '#d97706', mt: 0.1 }} />
                <Typography variant="body2" color="#92400e">{order.note}</Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
