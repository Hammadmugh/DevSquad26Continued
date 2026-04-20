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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import SearchIcon from '@mui/icons-material/Search';
import {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
  RawMaterial,
  CreateRawMaterialDto,
} from '@/lib/store/api/rawMaterialsApi';

const UNITS = ['g', 'ml', 'pcs', 'kg', 'l'];
const emptyForm: CreateRawMaterialDto = { name: '', unit: 'g', quantity: 0, minStockLevel: 0 };

const UNIT_COLORS: Record<string, string> = {
  g: '#6366f1', ml: '#0ea5e9', pcs: '#10b981', kg: '#f59e0b', l: '#8b5cf6',
};

export default function RawMaterialsPage() {
  const { data: materials = [], isLoading, isError } = useGetRawMaterialsQuery();
  const [createMaterial] = useCreateRawMaterialMutation();
  const [updateMaterial] = useUpdateRawMaterialMutation();
  const [deleteMaterial] = useDeleteRawMaterialMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<CreateRawMaterialDto>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setError(''); setDialogOpen(true); };
  const openEdit = (m: RawMaterial) => {
    setEditTarget(m);
    setForm({ name: m.name, unit: m.unit, quantity: m.quantity, minStockLevel: m.minStockLevel });
    setError(''); setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Name is required');
    setSaving(true); setError('');
    try {
      if (editTarget) { await updateMaterial({ id: editTarget._id, data: form }).unwrap(); }
      else { await createMaterial(form).unwrap(); }
      setDialogOpen(false);
    } catch (e: any) { setError(e?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this raw material?')) return;
    await deleteMaterial(id);
  };

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading)
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#6366f1' }} /></Box>;
  if (isError) return <Alert severity="error">Failed to load raw materials.</Alert>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Raw Materials</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage your inventory stock ({materials.length} materials)
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ px: 2.5 }}>
          Add Material
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search materials…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, maxWidth: 320, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(226,232,240,0.8)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Min Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <InventoryIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1, display: 'block', mx: 'auto' }} />
                  <Typography color="text.secondary" variant="body2">
                    {search ? 'No results found' : 'No raw materials yet. Add one!'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((m) => {
              const isLow = m.quantity <= m.minStockLevel;
              const pct = m.minStockLevel > 0 ? Math.min((m.quantity / (m.minStockLevel * 3)) * 100, 100) : 100;
              return (
                <TableRow key={m._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: `${UNIT_COLORS[m.unit] ?? '#6366f1'}20`, fontSize: 13, fontWeight: 700, color: UNIT_COLORS[m.unit] ?? '#6366f1' }}>
                        {m.name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>{m.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={m.unit} size="small" sx={{ bgcolor: `${UNIT_COLORS[m.unit] ?? '#6366f1'}15`, color: UNIT_COLORS[m.unit] ?? '#6366f1', fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color={isLow ? 'error.main' : 'text.primary'}>
                        {m.quantity.toLocaleString()} {m.unit}
                      </Typography>
                      <Box sx={{ mt: 0.5, height: 4, borderRadius: 2, bgcolor: '#f1f5f9', overflow: 'hidden', width: 80 }}>
                        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: isLow ? '#ef4444' : '#10b981', borderRadius: 2, transition: 'width 0.3s' }} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{m.minStockLevel} {m.unit}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={isLow ? 'Low Stock' : 'In Stock'} size="small"
                      sx={{ fontWeight: 700, bgcolor: isLow ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: isLow ? '#dc2626' : '#059669' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(m)} sx={{ color: '#6366f1', '&:hover': { bgcolor: 'rgba(99,102,241,0.1)' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(m._id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editTarget ? 'Edit Raw Material' : 'Add Raw Material'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField label="Unit" select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
            {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField>
          <TextField label="Current Stock Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} fullWidth inputProps={{ min: 0 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField label="Minimum Stock Alert Level" type="number" value={form.minStockLevel} onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })} fullWidth inputProps={{ min: 0 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ px: 3 }}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Raw Materials
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Raw Material
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Unit</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Min Level</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No raw materials yet. Add one!
                </TableCell>
              </TableRow>
            )}
            {materials.map((m) => {
              const isLow = m.quantity <= m.minStockLevel;
              return (
                <TableRow key={m._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{m.name}</TableCell>
                  <TableCell>{m.unit}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }} color={isLow ? 'error' : 'inherit'}>
                      {m.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{m.minStockLevel}</TableCell>
                  <TableCell>
                    <Chip
                      label={isLow ? 'Low Stock' : 'OK'}
                      color={isLow ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(m)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(m._id)}
                      >
                        <DeleteIcon fontSize="small" />
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
        <DialogTitle>{editTarget ? 'Edit Raw Material' : 'Add Raw Material'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Unit"
            select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            fullWidth
          >
            {UNITS.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Current Stock Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Minimum Stock Alert Level"
            type="number"
            value={form.minStockLevel}
            onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
