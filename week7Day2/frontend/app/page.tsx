import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import MarketTrendSection from '../components/home/MarketTrendSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ bgcolor: '#010010', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MarketTrendSection />
        <NewsletterSection />
      </main>
      <Footer />
    </Box>
  );
}
