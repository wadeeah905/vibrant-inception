import { useState } from "react";
import { HeroSection } from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import FAQ from "../components/FAQ";
import ReviewSection from "../components/ReviewSection";
import ProjectGallery from "../components/ProjectGallery";
import { WelcomeDialog } from "../components/WelcomeDialog";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <WelcomeDialog />
      <HeroSection />

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container">
          <h2 className="text-center font-sans text-3xl font-bold text-primary mb-8">Notre Collection</h2>
          <ProductGrid onAddToCart={() => setCartCount(prev => prev + 1)} />
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Reviews Section */}
      <ReviewSection />

      {/* Project Gallery */}
      <ProjectGallery />

      {/* FAQ Section */}
      <FAQ />
    </>
  );
};

export default Index;