
import { motion } from 'framer-motion';
import { Building2, MapPin, ExternalLink } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { suppliers } from '../../config/resellers';

interface PartnersSectionProps {
  onNavigateToRevendeurs: (e: React.MouseEvent) => void;
}

const PartnersSection = ({ onNavigateToRevendeurs }: PartnersSectionProps) => {
  return (
    <div className="py-16 mt-16 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-[#700100] mb-4">
            <Building2 className="w-6 h-6" />
            <h2 className="text-3xl font-playfair">Nos Partenaires de Confiance</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#700100] to-[#96cc39] mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Collaborant avec les meilleurs acteurs du secteur, nous nous engageons à vous offrir une qualité exceptionnelle à travers notre réseau de partenaires sélectionnés.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {suppliers.map((supplier) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 relative overflow-hidden border border-gray-100 hover:shadow-lg hover:border-[#96cc39]/30"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#96cc39]/10 to-[#700100]/5 rounded-bl-full -z-0"></div>
                
                <div className="h-20 flex items-center justify-center mb-6 relative z-10">
                  <img
                    src={supplier.logo}
                    alt={supplier.name}
                    className="h-16 w-auto object-contain transition-all duration-300"
                  />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-[#700100] font-semibold text-lg mb-3">{supplier.name}</h3>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3">{supplier.description}</p>
                  
                  <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Partenaire Officiel</span>
                    <a 
                      href="#" 
                      className="text-sm font-medium text-[#96cc39] hover:text-[#700100] flex items-center transition-colors"
                    >
                      <span>En savoir plus</span>
                      <ExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <motion.div
              className="flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg relative overflow-hidden border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#700100]/10 to-[#96cc39]/10 animate-pulse"></div>
                <MapPin className="w-10 h-10 text-[#700100] relative z-10" />
              </div>
              
              <h3 className="text-2xl font-playfair text-[#700100] mb-3">
                Trouvez nos produits près de chez vous
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                Découvrez notre réseau de revendeurs et points de vente partenaires où vous pouvez acheter nos produits de qualité.
              </p>
              
              <Button 
                onClick={onNavigateToRevendeurs}
                className="relative group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#700100] to-[#96cc39] transition-all duration-500 group-hover:scale-105"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#96cc39] to-[#700100] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                <span className="relative z-10 flex items-center text-white px-8 py-4 text-lg rounded-full">
                  Découvrir nos points de vente
                  <motion.div
                    className="ml-2"
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <MapPin className="w-5 h-5" />
                  </motion.div>
                </span>
              </Button>
              
              <motion.div 
                className="absolute -z-10 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#96cc39]/10 to-[#700100]/5 blur-3xl"
                style={{ bottom: '-150px', left: 'calc(50% - 150px)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersSection;
