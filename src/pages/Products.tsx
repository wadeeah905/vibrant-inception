
import { useState } from 'react';
import ProductDetail from './ProductDetail';
import type { ProductCategory } from '../types';
import {
  ProductsHero,
  ProductsGrid,
  MadeInTunisia,
  ProductTestimonials,
  PartnersSection
} from '../components/products';
import { PRODUCTS } from '../config/products';

interface ProductsProps {
  selectedCategory?: ProductCategory;
}

const Products = ({ selectedCategory }: ProductsProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Use products from the config
  const products = PRODUCTS;

  const filteredProducts = selectedCategory && selectedCategory !== 'tous'
    ? products.filter(product => product.category === selectedCategory)
    : products;

  // Handle navigation to the Revendeurs page
  const handleNavigateToRevendeurs = (e: React.MouseEvent) => {
    e.preventDefault();
    // This assumes you have a function to change pages in your parent component
    // that is similar to how you navigate to product details
    if (window.dispatchEvent) {
      const customEvent = new CustomEvent('navigateTo', { detail: { page: 'resellers' } });
      window.dispatchEvent(customEvent);
    }
    // Alternative direct approach if you're using a router
    // window.location.href = '/revendeurs';
  };

  if (selectedProductId) {
    return (
      <ProductDetail 
        productId={selectedProductId}
        onBack={() => setSelectedProductId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <ProductsHero />
      
      <div className="container mx-auto px-4">
        <ProductsGrid 
          products={filteredProducts} 
          onSelectProduct={setSelectedProductId} 
        />
        
        <MadeInTunisia />
        
        <ProductTestimonials />
        
        <PartnersSection onNavigateToRevendeurs={handleNavigateToRevendeurs} />
      </div>
    </div>
  );
};

export default Products;
