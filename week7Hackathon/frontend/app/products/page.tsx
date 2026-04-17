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
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">Failed to load products.</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Products
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Product
        </Button>
      </Box>

      {products.length === 0 && (
        <Alert severity="info">No products yet. Add a product with a recipe!</Alert>
      )}

      <Grid container spacing={3}>
        {products.map((p) => {
          const isAvailable = p.availableQuantity > 0;
          return (
            <Grid key={p._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" fontWeight={700}>
                      {p.name}
                    </Typography>
                    <Chip
                      label={isAvailable ? `${p.availableQuantity} available` : 'Out of Stock'}
                      color={isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mt: 1 }}>
                    PKR {p.price}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Recipe:
                  </Typography>
                  {p.recipe.map((r, i) => {
                    const mat = typeof r.materialId === 'string' ? null : r.materialId;
                    return (
                      <Typography key={i} variant="body2">
                        • {mat?.name ?? r.materialId}: {r.quantity} {mat?.unit ?? ''}
                      </Typography>
                    );
                  })}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(p)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Price (PKR)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            fullWidth
            inputProps={{ min: 0 }}
          />

          <Divider />
          <Typography variant="subtitle1" fontWeight={600}>
            Recipe / Ingredients
          </Typography>

          {form.recipe.map((r, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="Material"
                select
                value={r.materialId}
                onChange={(e) => updateIngredient(idx, 'materialId', e.target.value)}
                sx={{ flex: 2 }}
                size="small"
              >
                {materials.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name} ({m.unit})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Qty"
                type="number"
                value={r.quantity}
                onChange={(e) => updateIngredient(idx, 'quantity', Number(e.target.value))}
                sx={{ flex: 1 }}
                size="small"
                inputProps={{ min: 0.001, step: 0.1 }}
              />
              <IconButton color="error" size="small" onClick={() => removeIngredient(idx)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addIngredient} variant="outlined" size="small">
            Add Ingredient
          </Button>
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
