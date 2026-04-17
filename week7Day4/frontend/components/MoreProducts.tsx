'use client';

import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { Product } from '@/services/productsApi';
import { useAddToCartMutation } from '@/services/cartApi';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface MoreProductsProps {
  products: Product[];
}

export default function MoreProducts({ products }: MoreProductsProps) {
  const [addToCart] = useAddToCartMutation();

  const handleAdd = (product: Product) => {
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image });
  };

  return (
    <Box>
      {/* Title */}
      <Box sx={{ py: 4, px: { xs: 2, md: '50px' }, pb: 2 }}>
        <Typography
          sx={{
            fontFamily: 'Montserrat',
            fontWeight: 700,
            fontSize: { xs: 22, md: 40 },
            textTransform: 'uppercase',
            mb: 3,
          }}
        >
          More Nike Products
        </Typography>
      </Box>

      {/* Nike Membership Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 200, md: 324 },
          backgroundImage: 'url(/nike-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          px: { xs: 2, md: '50px' },
          py: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          mb: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Montserrat',
            fontStyle: 'italic',
            fontWeight: 900,
            fontSize: { xs: 26, md: 40 },
            color: '#fff',
            maxWidth: 308,
            lineHeight: 1.2,
          }}
        >
          YOUR NIKE MEMBERSHIP
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: { xs: 14, md: 20 },
            color: '#fff',
            maxWidth: 446,
          }}
        >
          Join our members and show your love with Nike By You!
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#fff',
            color: '#000',
            fontFamily: 'Montserrat',
            fontSize: { xs: 14, md: 16 },
            borderRadius: 4,
            px: 3,
            py: 1,
            width: { xs: 130, md: 150 },
            '&:hover': { bgcolor: '#eee' },
          }}
        >
          Join Us
        </Button>
      </Box>
    </Box>
  );
}
