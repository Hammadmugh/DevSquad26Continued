'use client';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import WarningIcon from '@mui/icons-material/Warning';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetDashboardQuery } from '@/lib/store/api/dashboardApi';

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardQuery(undefined, {
    pollingInterval: 10000,
  });

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError)
    return <Alert severity="error">Failed to load dashboard data.</Alert>;
  if (!data) return null;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={`PKR ${data.totalRevenue.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ShoppingBagIcon />}
            color="#388e3c"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Low Stock Alerts"
            value={data.lowStockCount}
            icon={<WarningIcon />}
            color={data.lowStockCount > 0 ? '#f57c00' : '#9e9e9e'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Products"
            value={data.products.length}
            icon={<EmojiObjectsIcon />}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Revenue – Last 7 Days
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.salesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v: string) => v.slice(5)}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v: number) => [`PKR ${v}`, 'Revenue']}
                  />
                  <Bar dataKey="total" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Top Selling Products
              </Typography>
              {data.topProducts.length === 0 ? (
                <Typography color="text.secondary">No sales yet.</Typography>
              ) : (
                <List dense>
                  {data.topProducts.map((p, i) => (
                    <ListItem
                      key={p.name}
                      secondaryAction={
                        <Chip
                          label={`${p.totalSold} sold`}
                          size="small"
                          color="primary"
                        />
                      }
                    >
                      <ListItemText primary={`${i + 1}. ${p.name}`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {data.lowStockMaterials.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper elevation={2} sx={{ p: 2, borderLeft: '4px solid #f57c00' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} color="#f57c00">
                Low Stock Raw Materials
              </Typography>
              <Grid container spacing={1}>
                {data.lowStockMaterials.map((m) => (
                  <Grid key={m._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: '#fff3e0',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {m.name}
                      </Typography>
                      <Typography variant="body2" color="error">
                        {m.quantity} {m.unit} left
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
