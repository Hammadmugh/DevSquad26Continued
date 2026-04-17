'use client';

import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState } from 'react';
import { Product } from '@/services/productsApi';
import { useAddToCartMutation } from '@/services/cartApi';

interface TopSneakersProps {
  products: Product[];
}

export default function TopSneakers({ products }: TopSneakersProps) {
  const topProducts = products.filter((p) => !p.isNew);
  const [active, setActive] = useState(1);
  const [addToCart] = useAddToCartMutation();

  if (!topProducts.length) return null;

  const len = topProducts.length;
  const prev = () => setActive((a) => (a - 1 + len) % len);
  const next = () => setActive((a) => (a + 1) % len);

  const handleAdd = (product: Product) => {
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image });
  };

  // Show 3 items centered around `active`
  const visibleIndices = [
    (active - 1 + len) % len,
    active % len,
    (active + 1) % len,
  ];

  return (
    <Box sx={{ py: 4, overflow: 'hidden' }}>
      {/* Summertime Mood */}
      <Box sx={{ textAlign: 'center', mb: 4, px: 2 }}>
        <Typography
          sx={{
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: { xs: 18, md: 40 },
            color: '#000',
          }}
        >
          At the moment
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Montserrat',
            fontStyle: 'italic',
            fontWeight: 900,
            fontSize: { xs: 34, md: 80 },
            color: '#000',
            lineHeight: 1.1,
          }}
        >
          SUMMERTIME MOOD
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: { xs: 14, md: 40 },
            color: '#000',
            mt: 0.5,
          }}
        >
          Fight the heat in a sunny look!
        </Typography>
      </Box>

      {/* Header row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: '50px' },
          mb: 2,
        }}
      >
        <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: { xs: 22, md: 40 } }}>
          Top sneakers
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={prev}
            sx={{ bgcolor: '#F5F5F5', borderRadius: '35px', width: 55, height: 55 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={next}
            sx={{ bgcolor: '#C6C6C6', borderRadius: '35px', width: 55, height: 55 }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 3-card carousel: left | center (bigger) | right */}
      {/* Mobile: each card = 50vw, track shifted -25vw so side cards peek exactly 25vw each */}
      <Box sx={{ overflow: { xs: 'hidden', md: 'visible' } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: { xs: 0, md: 2 },
          px: { xs: 0, md: '50px' },
          transform: { xs: 'translateX(-25vw)', md: 'none' },
          transition: 'transform 0.3s ease',
        }}
      >
        {visibleIndices.map((idx, position) => {
          const product = topProducts[idx];
          const isCenter = position === 1;
          return (
            <Box
              key={product.id + '-' + position}
              sx={{
                flex: { xs: '0 0 50vw', md: isCenter ? '0 0 36%' : '0 0 30%' },
                px: { xs: '6px', md: 0 },
                boxSizing: 'border-box',
              }}
            >
            <Box
              sx={{
                bgcolor: '#EFEFEF',
                borderRadius: '18px',
                boxShadow: '5px 5px 25px rgba(0,0,0,0.25)',
                p: { xs: 2, md: 3 },
                minHeight: { xs: 340, md: isCenter ? 580 : 480 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              {/* NIKE watermark */}
              <Typography
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%) rotate(90deg)',
                  fontFamily: 'Poppins',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: { xs: 80, md: 160 },
                  color: 'rgba(0,0,0,0.05)',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                NIKE
              </Typography>

              {/* Shoe image */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '8%',
                  left: '5%',
                  right: '5%',
                  height: '55%',
                }}
              >
                <Image
                  src={product.image || '/top-1.png'}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.25))',
                  }}
                />
              </Box>

              {/* Info */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: 'Work Sans',
                    fontWeight: 700,
                    fontSize: isCenter ? { xs: 18, md: 40 } : { xs: 14, md: 28 },
                    lineHeight: 1.1,
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography sx={{ fontFamily: 'Work Sans', fontSize: isCenter ? { xs: 14, md: 20 } : { xs: 12, md: 16 } }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <IconButton
                    onClick={() => handleAdd(product)}
                    sx={{ bgcolor: '#fff', borderRadius: '35px', width: isCenter ? 55 : 45, height: isCenter ? 55 : 45 }}
                  >
                    <AddShoppingCartIcon fontSize={isCenter ? 'medium' : 'small'} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            </Box>
          );
        })}
      </Box>
      </Box>
    </Box>
  );
}
