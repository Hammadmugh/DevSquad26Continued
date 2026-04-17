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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
  RawMaterial,
  CreateRawMaterialDto,
} from '@/lib/store/api/rawMaterialsApi';

const UNITS = ['g', 'ml', 'pcs', 'kg', 'l'];

const emptyForm: CreateRawMaterialDto = {
  name: '',
  unit: 'g',
  quantity: 0,
  minStockLevel: 0,
};

export default function RawMaterialsPage() {
  const { data: materials, isLoading, isError } = useGetRawMaterialsQuery();
  const [createMaterial] = useCreateRawMaterialMutation();
  const [updateMaterial] = useUpdateRawMaterialMutation();
  const [deleteMaterial] = useDeleteRawMaterialMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<CreateRawMaterialDto>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (m: RawMaterial) => {
    setEditTarget(m);
    setForm({ name: m.name, unit: m.unit, quantity: m.quantity, minStockLevel: m.minStockLevel });
    setError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Name is required');
    setSaving(true);
    setError('');
    try {
      if (editTarget) {
        await updateMaterial({ id: editTarget._id, data: form }).unwrap();
      } else {
        await createMaterial(form).unwrap();
      }
      setDialogOpen(false);
    } catch (e: any) {
      setError(e?.data?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this raw material?')) return;
    await deleteMaterial(id);
  };

  if (isLoading || materials === undefined)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">Failed to load raw materials.</Alert>;

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
