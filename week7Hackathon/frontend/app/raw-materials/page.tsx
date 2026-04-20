'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  Avatar,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
} from '@/lib/store/api/rawMaterialsApi';

const UNITS = ['kg', 'g', 'L', 'mL', 'pcs', 'dozen'];

const UNIT_COLORS: Record<string, string> = {
  kg: '#6366f1',
  g: '#8b5cf6',
  L: '#06b6d4',
  mL: '#0ea5e9',
  pcs: '#10b981',
  dozen: '#f59e0b',
};

interface RawMaterialForm {
  name: string;
  unit: string;
  quantity: number;
  minStockLevel: number;
}

const defaultForm: RawMaterialForm = { name: '', unit: 'kg', quantity: 0, minStockLevel: 0 };

export default function RawMaterialsPage() {
  const { data: materials = [], isLoading } = useGetRawMaterialsQuery();
  const [createRawMaterial] = useCreateRawMaterialMutation();
  const [updateRawMaterial] = useUpdateRawMaterialMutation();
  const [deleteRawMaterial] = useDeleteRawMaterialMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [form, setForm] = useState<RawMaterialForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm(defaultForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (m: { _id: string; name: string; unit: string; quantity: number; minStockLevel: number }) => {
    setEditTarget(m._id);
    setForm({ name: m.name, unit: m.unit, quantity: m.quantity, minStockLevel: m.minStockLevel });
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await updateRawMaterial({ id: editTarget, data: form }).unwrap();
      } else {
        await createRawMaterial(form).unwrap();
      }
      setDialogOpen(false);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this raw material?')) return;
    await deleteRawMaterial(id);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
            Raw Materials
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {materials.length} materials in inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}
        >
          Add Raw Material
        </Button>
      </Box>

      {/* Search bar */}
      <TextField
        placeholder="Search materials..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, width: 320, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.12)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              }}
            >
              <TableCell sx={{ color: 'white', fontWeight: 700, py: 2 }}>Material</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Unit</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Stock Level</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Min Level</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {search ? 'No materials match your search.' : 'No raw materials yet. Add one!'}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((m) => {
              const isLow = m.quantity <= m.minStockLevel;
              const pct = m.minStockLevel > 0 ? Math.min((m.quantity / (m.minStockLevel * 3)) * 100, 100) : 100;
              const initials = m.name.slice(0, 2).toUpperCase();
              const unitColor = UNIT_COLORS[m.unit] ?? '#6366f1';
              return (
                <TableRow
                  key={m._id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: 'rgba(99,102,241,0.04)' },
                    transition: 'background 0.15s',
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: 13,
                          fontWeight: 700,
                          background: `linear-gradient(135deg, ${unitColor} 0%, ${unitColor}99 100%)`,
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{m.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={m.unit}
                      size="small"
                      sx={{
                        bgcolor: `${unitColor}18`,
                        color: unitColor,
                        fontWeight: 700,
                        fontSize: 11,
                        border: `1px solid ${unitColor}40`,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 140 }}>
                    <Typography color={isLow ? 'error' : 'inherit'} sx={{ fontWeight: 600, mb: 0.5 }}>
                      {m.quantity}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: isLow ? '#ef4444' : '#10b981',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{m.minStockLevel}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={isLow ? 'Low Stock' : 'OK'}
                      color={isLow ? 'warning' : 'success'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(m)}
                        sx={{
                          color: '#6366f1',
                          '&:hover': { bgcolor: 'rgba(99,102,241,0.1)' },
                          mr: 0.5,
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(m._id)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                        }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editTarget ? 'Edit Raw Material' : 'Add Raw Material'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Unit"
            select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField>
          <TextField
            label="Current Stock Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            fullWidth
            slotProps={{ htmlInput: { min: 0 } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Minimum Stock Alert Level"
            type="number"
            value={form.minStockLevel}
            onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
            fullWidth
            slotProps={{ htmlInput: { min: 0 } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}