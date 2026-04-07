import Aboutus from "@/components/Aboutus";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveAuctionSection from "@/components/LiveAuctionSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="relative w-full min-h-screen">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/hero-img.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 w-full h-full" style={{ background: 'rgba(20, 30, 70, 0.55)', zIndex: 1 }} />

        {/* Content on top */}
        <div className="relative" style={{ zIndex: 2 }}>
          <Aboutus />
          <Navbar />
          <HeroSection />
        </div>
      </div>

      <LiveAuctionSection />
      <Footer />
    </>
  );
}

