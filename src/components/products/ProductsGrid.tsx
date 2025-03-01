
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductsGridProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProductsGrid;
