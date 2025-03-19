
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '../../types';
import { useTranslation } from 'react-i18next';
import FiguesIcon from '../badges/FiguesIcon';

interface ProductsGridProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  subcategory?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onSelectProduct, subcategory }) => {
  const { t } = useTranslation();
  
  // We don't need additional filtering here since Products.tsx already filters by productId
  // This ensures we show exactly what was requested
  const filteredProducts = products;
  
  return (
    <div className="py-8">
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 text-lg">{t('products.no_products_found')}</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 } 
              }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <ProductCard product={product} onSelect={onSelectProduct} />
              {product.title === 'Figues djebaa 200g' && (
                <div className="absolute top-2 right-2">
                  <FiguesIcon size={32} color="#700100" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductsGrid;
