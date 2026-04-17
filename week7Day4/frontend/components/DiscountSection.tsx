'use client';

import { Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { Product } from '@/services/productsApi';
import { useAddToCartMutation } from '@/services/cartApi';

const DISCOUNT_IMAGES = ['/discounted-1.png', '/discounted-2.png'];

interface DiscountSectionProps {
  products: Product[];
}

export default function DiscountSection({ products }: DiscountSectionProps) {
  // Use first two non-new products for discount section, fallback to any
  const discountProducts = products.filter((p) => !p.isNew).slice(0, 2);
  const [addToCart] = useAddToCartMutation();

  const handleAdd = (product: Product) => {
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image });
  };

  if (!discountProducts.length) return null;

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: '50px' } }}>
      <Typography
        sx={{
          fontFamily: 'Montserrat',
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: { xs: 18, md: 40 },
          textAlign: 'center',
          mb: 4,
        }}
      >
        LOOKS GOOD. RUNS GOOD. FEELS GOOD.
      </Typography>

      <Grid container spacing={3}>
        {discountProducts.map((product, i) => (
          <Grid size={{ xs: 12, md: 6 }} key={product.id}>
            <Box
              sx={{
                position: 'relative',
                bgcolor: '#EFEFEF',
                borderRadius: '18px',
                boxShadow: '5px 5px 25px rgba(0,0,0,0.25)',
                p: 3,
                minHeight: { xs: 240, md: 273 },
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Shoe image – rotated, right side */}
              <Box
                sx={{
                  position: 'absolute',
                  right: '-5%',
                  bottom: '-10%',
                  width: { xs: '55%', md: '60%' },
                  height: '130%',
                  pointerEvents: 'none',
                }}
              >
                <Image
                  src={DISCOUNT_IMAGES[i] ?? product.image}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.25))',
                    transform: 'rotate(-30deg)',
                  }}
                />
              </Box>

              {/* Text content */}
              <Box sx={{ maxWidth: '52%', position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Montserrat',
                      fontWeight: 700,
                      fontSize: { xs: 22, md: 30 },
                      color: '#FF3939',
                    }}
                  >
                    -20%
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Montserrat',
                      fontWeight: 700,
                      fontSize: { xs: 18, md: 24 },
                      color: '#FF3939',
                    }}
                  >
                    Discount
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'Montserrat',
                    fontSize: { xs: 14, md: 20 },
                    color: '#202727',
                    mt: 1,
                  }}
                >
                  on your first purchase
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleAdd(product)}
                  sx={{
                    mt: 3,
                    bgcolor: '#000',
                    color: '#fff',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: 14, md: 20 },
                    borderRadius: '16px',
                    px: 3,
                    py: 1,
                    '&:hover': { bgcolor: '#333' },
                  }}
                >
                  Shop now
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
