import { useState } from 'react';
import ProductDetail from './ProductDetail';
import {
  ProductsHero,
  ProductsGrid,
  MadeInTunisia,
  ProductTestimonials,
  PartnersSection
} from '../components/products';
import { PRODUCTS } from '../config/products';

interface ProductsProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedProductId?: string;
}

const Products = ({ selectedCategory, selectedSubcategory, selectedProductId }: ProductsProps) => {
  const [selectedProductIdState, setSelectedProductId] = useState<string | null>(selectedProductId || null);

  // Use products from the config
  const products = PRODUCTS;

  // Filter products based on multiple criteria
  let filteredProducts = products;
  
  // If a specific product ID is provided, filter to only that product
  if (selectedProductId) {
    filteredProducts = products.filter(product => product.id === selectedProductId);
  }
  // Otherwise, filter by category/subcategory
  else if (selectedCategory && selectedCategory !== 'tous') {
    // Handle comma-separated categories
    if (selectedCategory.includes(',')) {
      filteredProducts = products.filter(product => 
        selectedCategory.split(',').includes(product.category)
      );
    } else {
      filteredProducts = products.filter(product => product.category === selectedCategory);
    }

    // Further filter by subcategory if provided
    if (selectedSubcategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.subcategory === selectedSubcategory
      );
    }
  }

  // Handle navigation to the Revendeurs page
  const handleNavigateToRevendeurs = (e: React.MouseEvent) => {
    e.preventDefault();
    // This assumes you have a function to change pages in your parent component
    // that is similar to how you navigate to product details
    if (window.dispatchEvent) {
      const customEvent = new CustomEvent('navigateTo', { detail: { page: 'resellers' } });
      window.dispatchEvent(customEvent);
    }
  };

  if (selectedProductIdState) {
    return (
      <ProductDetail 
        productId={selectedProductIdState}
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
          subcategory={selectedSubcategory}
        />
        
        <MadeInTunisia />
        
        <ProductTestimonials />
        
        <PartnersSection onNavigateToRevendeurs={handleNavigateToRevendeurs} />
      </div>
    </div>
  );
};

export default Products;
