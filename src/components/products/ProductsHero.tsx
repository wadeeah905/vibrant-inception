
import { motion } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';

const ProductsHero = () => {
  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="productsbanner.png"
            alt="Produits Tazart - Dattes premium et produits dérivés"
            className="w-full h-full object-cover opacity-100"
            priority={true}
            loading="eager"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Notre Sélection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-playfair text-[#700100] mb-4">
            Notre Sélection
          </h2>
          <div className="w-24 h-1 bg-[#96cc39] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme de dattes premium et produits dérivés, 
            soigneusement sélectionnés pour leur qualité exceptionnelle.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ProductsHero;
