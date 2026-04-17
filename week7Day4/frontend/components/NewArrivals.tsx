'use client';

import { Box, Grid, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { Product } from '@/services/productsApi';
import { useAddToCartMutation } from '@/services/cartApi';

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const newProducts = products.filter((p) => p.isNew).slice(0, 2);
  const [addToCart] = useAddToCartMutation();

  if (!newProducts.length) return null;

  const handleAdd = (product: Product) => {
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image });
  };

  return (
    <Box sx={{ px: { xs: 2, md: '50px' }, pt: 4, pb: 2 }}>
      <Grid container spacing={3}>
        {newProducts.map((product) => (
          <Grid size={{ xs: 12, md: 6 }} key={product.id}>
            <Box sx={{ pt: '80px', position: 'relative' }}>
              {/* Shoe protruding above the card */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: '5%',
                  width: { xs: '55%', md: '58%' },
                  height: 240,
                  zIndex: 2,
                  filter: 'drop-shadow(0px 22px 45px rgba(0,0,0,0.25))',
                  transform: 'rotate(-28deg)',
                }}
              >
                <Image src={product.image || '/new-1.png'} alt={product.name} fill style={{ objectFit: 'contain' }} />
              </Box>

              {/* Card body */}
              <Box
                sx={{
                  bgcolor: '#EFEFEF',
                  borderRadius: '18px',
                  boxShadow: '5px 5px 25px rgba(0,0,0,0.25)',
                  px: 3,
                  pt: 6,
                  pb: 3,
                  minHeight: 200,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Montserrat',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    fontSize: { xs: 36, md: 48 },
                    color: '#FF3939',
                    lineHeight: 1,
                  }}
                >
                  NEW
                </Typography>
                <Typography
                  sx={{ fontFamily: 'Montserrat', fontSize: { xs: 13, md: 20 }, mt: 1, maxWidth: '50%' }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton
                    onClick={() => handleAdd(product)}
                    sx={{ bgcolor: '#fff', borderRadius: '35px', width: 55, height: 55, boxShadow: 1 }}
                  >
                    <NorthEastIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
