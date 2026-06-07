import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import { FeaturedProducts, BestSellers, NewArrivals } from "@/components/home/FeaturedProducts";
import { OfferBanner, WhyChooseUs, TestimonialsSection, InstagramGallery } from "@/components/home/OfferBanner";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <OfferBanner />
        <BestSellers />
        <WhyChooseUs />
        <NewArrivals />
        <TestimonialsSection />
        <InstagramGallery />
      </main>
      <Footer />
    </>
  );
}
