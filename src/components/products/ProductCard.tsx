
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import type { Product } from '../../types';
import OptimizedImage from '../ui/OptimizedImage';

interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  // Function to handle click on the entire card
  const handleCardClick = () => {
    onSelect(product.id);
  };

  // Animation variants for the badge - updated to appear from top with slower animation
  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      y: -100,
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
        stiffness: 100, // Reduced stiffness for slower animation
        damping: 15,
        duration: 1.2, // Longer duration
        delay: Number(product.id) * 0.15 + 0.5 // Increased delay
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 200,
        duration: 0.8 // Slower hover animation
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
            src="produitstemplate.png"
            alt={product.title}
            className="w-full aspect-[4/4] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Circular badge positioned at the bottom right of the image with cool animation */}
          <motion.div
            className="absolute -bottom-6 -right-[-80px] z-10"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={badgeVariants}
          >
            <div className="w-[120px] h-20">
              <OptimizedImage 
                src="https://i.ibb.co/CKznp9Q1/Design-sans-titre-1-removebg-preview.png" 
                alt="Product Type" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
        
        <div className="pt-6 pb-4 px-2">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-playfair text-[#700100]">
              {product.title}
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
              <span className="text-sm font-medium">Consulter</span>
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
