import AnnouncementBanner from "@/components/AnnouncementBanner";
import Brands from "@/components/Brands";
import BrowseByStyle from "@/components/BrowseByStyle";
import Footer from "@/components/Footer";
import HappyCustomers from "@/components/HappyCustomers";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import NewArrivals from "@/components/NewArrivals";
import TopSellings from "@/components/TopSellings";

export default function Home() {
  return (
    <>
    <AnnouncementBanner/>
    <Navbar/>
    <HeroSection/>
    <section id="brands"><Brands/></section>
    <section id="new-arrivals"><NewArrivals/></section>
    <section id="on-sale"><TopSellings/></section>
    <BrowseByStyle/>
    <HappyCustomers/>
    <Footer/>
    </>
  );
}
