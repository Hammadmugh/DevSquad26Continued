'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Tooltip,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  Product,
  CreateProductDto,
} from '@/lib/store/api/productsApi';
import { useGetRawMaterialsQuery } from '@/lib/store/api/rawMaterialsApi';

const emptyForm: CreateProductDto = { name: '', price: 0, recipe: [] };

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', light: 'rgba(99,102,241,0.08)' },
  { bg: 'linear-gradient(135deg, #10b981, #059669)', light: 'rgba(16,185,129,0.08)' },
  { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', light: 'rgba(245,158,11,0.08)' },
  { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', light: 'rgba(139,92,246,0.08)' },
  { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', light: 'rgba(239,68,68,0.08)' },
  { bg: 'linear-gradient(135deg, #0ea5e9, #0284c7)', light: 'rgba(14,165,233,0.08)' },
];

export default function ProductsPage() {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const { data: materials = [] } = useGetRawMaterialsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<CreateProductDto>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      price: p.price,
      recipe: p.recipe.map((r) => ({
        materialId: typeof r.materialId === 'string' ? r.materialId : r.materialId._id,
        quantity: r.quantity,
      })),
    });
    setError('');
    setDialogOpen(true);
  };

  const addIngredient = () =>
    setForm({ ...form, recipe: [...form.recipe, { materialId: '', quantity: 1 }] });

  const removeIngredient = (idx: number) =>
    setForm({ ...form, recipe: form.recipe.filter((_, i) => i !== idx) });

  const updateIngredient = (idx: number, field: 'materialId' | 'quantity', value: string | number) =>
    setForm({
      ...form,
      recipe: form.recipe.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    });

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Name is required');
    if (form.recipe.length === 0) return setError('Add at least one ingredient');
    if (form.recipe.some((r) => !r.materialId)) return setError('Select a material for all ingredients');
    setSaving(true);
    setError('');
    try {
      if (editTarget) {
        await updateProduct({ id: editTarget._id, data: form }).unwrap();
      } else {
        await createProduct(form).unwrap();
      }
      setDialogOpen(false);
    } catch (e: any) {
      setError(e?.data?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
  };

  if (isLoading)
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#6366f1' }} /></Box>;
  if (isError) return <Alert severity="error">Failed to load products.</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Products</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {products.length} products with recipe-based availability
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ px: 2.5 }}>
          Add Product
        </Button>
      </Box>

      {products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#fff', borderRadius: 3, border: '1px dashed #e2e8f0' }}>
          <StorefrontIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 2 }} />
          <Typography fontWeight={600} color="text.secondary">No products yet</Typography>
          <Typography variant="body2" color="text.secondary">Add a product with a recipe to get started</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {products.map((p, idx) => {
          const color = CARD_COLORS[idx % CARD_COLORS.length];
          const available = p.availableQuantity > 0;
          return (
            <Grid key={p._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)' } }}>
                <Box sx={{ height: 6, background: color.bg, borderRadius: '16px 16px 0 0' }} />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Avatar sx={{ background: color.bg, width: 44, height: 44 }}>
                      <StorefrontIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Chip
                      label={available ? `${p.availableQuantity} available` : 'Out of Stock'}
                      size="small"
                      sx={{ fontWeight: 700, bgcolor: available ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: available ? '#059669' : '#dc2626' }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={800} mb={0.5}>{p.name}</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ background: color.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1.5 }}>
                    PKR {p.price.toLocaleString()}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((p.availableQuantity / Math.max(p.availableQuantity * 1.5, 1)) * 100, 100)}
                      sx={{ height: 5, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: color.bg, borderRadius: 3 } }}
                    />
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Recipe</Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {p.recipe.map((r, i) => {
                      const mat = typeof r.materialId === 'string' ? null : r.materialId;
                      return (
                        <Chip key={i} label={`${mat?.name ?? 'Material'}: ${r.quantity}${mat?.unit ?? ''}`} size="small"
                          sx={{ fontSize: 11, bgcolor: color.light, color: 'text.primary', fontWeight: 500 }} />
                      );
                    })}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0, gap: 0.5 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: '#6366f1', bgcolor: 'rgba(99,102,241,0.07)', '&:hover': { bgcolor: 'rgba(99,102,241,0.14)' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(p._id)} sx={{ color: '#ef4444', bgcolor: 'rgba(239,68,68,0.07)', '&:hover': { bgcolor: 'rgba(239,68,68,0.14)' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editTarget ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
          <TextField label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField label="Price (PKR)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} fullWidth inputProps={{ min: 0 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <Divider />
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Recipe / Ingredients
          </Typography>
          {form.recipe.map((r, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: '#f8fafc', p: 1.5, borderRadius: 2 }}>
              <TextField label="Material" select value={r.materialId} onChange={(e) => updateIngredient(idx, 'materialId', e.target.value)} sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} size="small">
                {materials.map((m) => <MenuItem key={m._id} value={m._id}>{m.name} ({m.unit})</MenuItem>)}
              </TextField>
              <TextField label="Qty" type="number" value={r.quantity} onChange={(e) => updateIngredient(idx, 'quantity', Number(e.target.value))} sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }} size="small" inputProps={{ min: 0.001, step: 0.1 }} />
              <IconButton color="error" size="small" onClick={() => removeIngredient(idx)} sx={{ bgcolor: 'rgba(239,68,68,0.07)' }}>
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={addIngredient} variant="outlined" size="small" sx={{ borderStyle: 'dashed', borderRadius: 2 }}>
            Add Ingredient
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ px: 3 }}>
            {saving ? 'Saving…' : 'Save Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
