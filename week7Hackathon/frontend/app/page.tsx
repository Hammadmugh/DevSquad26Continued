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
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CategoryIcon from '@mui/icons-material/Category';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGetDashboardQuery } from '@/lib/store/api/dashboardApi';

const CARDS = [
  {
    key: 'revenue',
    title: 'Total Revenue',
    icon: <TrendingUpIcon />,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    light: 'rgba(99,102,241,0.1)',
    iconColor: '#6366f1',
  },
  {
    key: 'orders',
    title: 'Total Orders',
    icon: <ShoppingBagIcon />,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    light: 'rgba(16,185,129,0.1)',
    iconColor: '#10b981',
  },
  {
    key: 'lowStock',
    title: 'Low Stock Alerts',
    icon: <WarningAmberIcon />,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    light: 'rgba(245,158,11,0.1)',
    iconColor: '#f59e0b',
  },
  {
    key: 'products',
    title: 'Active Products',
    icon: <CategoryIcon />,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    light: 'rgba(139,92,246,0.1)',
    iconColor: '#8b5cf6',
  },
];

function StatCard({
  title,
  value,
  icon,
  gradient,
  light,
  iconColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  light: string;
  iconColor: string;
}) {
  return (
    <Card sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative accent */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: light,
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ background: gradient, width: 48, height: 48, boxShadow: `0 4px 14px ${light}` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }} color="#6366f1">PKR {payload[0].value.toLocaleString()}</Typography>
      </Box>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardQuery(undefined, { pollingInterval: 10000 });

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  if (isError) return <Alert severity="error">Failed to load dashboard data.</Alert>;
  if (!data) return null;

  const maxSold = Math.max(...data.topProducts.map((p) => p.totalSold), 1);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Welcome back — here&apos;s your business snapshot.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {CARDS.map((c, i) => {
          const values = [
            `PKR ${data.totalRevenue.toLocaleString()}`,
            data.totalOrders,
            data.lowStockCount,
            data.products.length,
          ];
          return (
            <Grid key={c.key} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title={c.title}
                value={values[i]}
                icon={c.icon}
                gradient={c.gradient}
                light={c.light}
                iconColor={c.iconColor}
              />
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Area Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Revenue — Last 7 Days
              </Typography>
              <Typography variant="caption" color="text.secondary">Daily sales performance</Typography>
              <Box sx={{ mt: 2 }}>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={data.salesChart}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Top Selling Products
              </Typography>
              <Typography variant="caption" color="text.secondary">By units sold</Typography>
              <Box sx={{ mt: 2 }}>
                {data.topProducts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="body2">No sales recorded yet.</Typography>
                  </Box>
                ) : (
                  data.topProducts.map((p, i) => (
                    <Box key={p.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {i + 1}. {p.name}
                        </Typography>
                        <Chip label={`${p.totalSold} sold`} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1', fontWeight: 700 }} />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(p.totalSold / maxSold) * 100}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 3 } }}
                      />
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock */}
        {data.lowStockMaterials.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ border: '1px solid rgba(245,158,11,0.3)', bgcolor: '#fffbeb' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WarningAmberIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#92400e' }}>
                    Low Stock Alerts
                  </Typography>
                  <Chip label={data.lowStockMaterials.length} size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700 }} />
                </Box>
                <Grid container spacing={1.5}>
                  {data.lowStockMaterials.map((m) => (
                    <Grid key={m._id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Min: {m.minStockLevel} {m.unit}</Typography>
                        </Box>
                        <Chip label={`${m.quantity} ${m.unit}`} size="small" color="warning" sx={{ fontWeight: 700 }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
