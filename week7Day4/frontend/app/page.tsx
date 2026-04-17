'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useGetProductsQuery } from '@/services/productsApi';
import HeroBanner from '@/components/HeroBanner';
import NewArrivals from '@/components/NewArrivals';
import TopSneakers from '@/components/TopSneakers';
import BuyByCategory from '@/components/BuyByCategory';
import DiscountSection from '@/components/DiscountSection';
import MoreProducts from '@/components/MoreProducts';
import UkraineSection from '@/components/UkraineSection';

export default function Home() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !products) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">
          Failed to load products. Make sure the backend is running on port 3000.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <HeroBanner />
      <NewArrivals products={products} />
      <TopSneakers products={products} />
      <BuyByCategory />
      <DiscountSection products={products} />
      <MoreProducts products={products} />
      <UkraineSection />
    </Box>
  );
}

