
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import OptimizedImage from '../ui/OptimizedImage';
import { getProductTranslationPath } from '../../utils/productTranslations';

interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const { t } = useTranslation();
  
  // Function to handle click on the entire card
  const handleCardClick = () => {
    onSelect(product.id);
  };

  // Get translation info for this product
  const translationInfo = getProductTranslationPath(product.title);

  // Function to determine which badge image to show based on the product category
  const getBadgeImage = () => {
    if (product.category === 'figues-sechees' as any) {
      // Special case for Figues Toujane
      if (product.id === '14' && product.title === 'Figues Toujane 200g') {
        return "/produits/toujanevracicon.png";
      }
      
      // Special case for Figues ZIDI 200g
      if (product.id === '9' && product.title === 'Figues ZIDI 200g') {
        return "/produits/figuesechesicon.png";
      }
      
      // Special case for Figues djebaa 200g
      if (product.id === '15' && product.title === 'Figues djebaa 200g') {
        return "/produits/figuesechesicon.png";
      }
      
      // Figues Séchées en Vrac doesn't get a badge
      if (product.id === '10' && product.title === 'Figues Séchées en Vrac') {
        return "";
      }
      
      // Default case for other figue products
      return "/produits/figuesechesicon.png";
    } else if (product.category === 'sucre-dattes' as any) {
      return "/produits/sucredatteicon.png";
    } else if (product.category === 'cafe-dattes' as any) {
      return "/produits/caffeicon.png";
    } else if (product.category === 'sirop-dattes' as any) { 
      return "/produits/dattesicon.png";   
    }
    
    return "";
  };

  // Determine if the product should show a badge
  const shouldShowBadge = () => {
    // Specific checks for figue products
    if (product.category === 'figues-sechees' as any) {
      // No badge for Figues Séchées en Vrac
      if (product.id === '10' && product.title === 'Figues Séchées en Vrac') {
        return false;
      }
      
      // Badge for Figues djebaa 200g
      if (product.id === '15' && product.title === 'Figues djebaa 200g') {
        return true;
      }
      
      // Badge for Figues ZIDI 200g and Figues Toujane 200g
      return (product.id === '9' && product.title === 'Figues ZIDI 200g') || 
             (product.id === '14' && product.title === 'Figues Toujane 200g');
    }
    
    // Regular check for other categories
    return ['sucre-dattes', 'cafe-dattes', 'sirop-dattes'].includes(product.category as string);
  };

  // Animation variants for the badge - updated for better positioning
  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      rotate: -15,
      scale: 0.5
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15,
        duration: 1.2,
        delay: Number(product.id) * 0.15 + 0.5
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 200,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Number(product.id) * 0.1 }}
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="overflow-hidden rounded-2xl">
        <div className="relative">
          <OptimizedImage
            src={product.image}
            alt={translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
            className="w-full aspect-[4/4] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badge with improved responsive positioning that's slightly lower and more to the left */}
          {shouldShowBadge() && (
            <motion.div
              className="absolute top-[81%] right-[20%] z-10 w-[110px] sm:w-[130px] md:w-[150px] transform translate-x-[20%] sm:translate-x-[15%] md:translate-x-[10%]"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={badgeVariants}
            >
              <div className="w-full h-auto">
                <OptimizedImage 
                  src={getBadgeImage()} 
                  alt="Product Type" 
                  className="w-[220px] h-full object-contain"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="pt-6 pb-4 px-2">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-playfair text-[#700100]">
              {translationInfo.key ? t(translationInfo.key) : translationInfo.fallback}
            </h3>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                onSelect(product.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#700100] flex items-center gap-2 hover:text-[#96cc39] transition-colors duration-300"
            >
              <span className="text-sm font-medium">{t('products.view_details')}</span>
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
