
import { motion } from 'framer-motion';
import { Building2, ExternalLink } from 'lucide-react';
import { suppliers } from '../../config/resellers';
import { useTranslation } from 'react-i18next';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";

interface PartnersSectionProps {
  onNavigateToRevendeurs: (e: React.MouseEvent) => void;
}

const PartnersSection = ({ onNavigateToRevendeurs }: PartnersSectionProps) => {
  const { t } = useTranslation();
  
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
            <h2 className="text-3xl font-playfair">{t('resellers.our_distribution_partners')}</h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#700100] to-[#96cc39] mx-auto mb-8 rounded-full"></div>
          
          {/* Partners carousel */}
          <div className="mb-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {suppliers.map((supplier) => (
                  <CarouselItem key={supplier.id} className="md:basis-1/3 lg:basis-1/3">
                  <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8 }}
                      className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 relative overflow-hidden border border-gray-100 hover:shadow-lg hover:border-[#96cc39]/30 h-full mx-2"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#96cc39]/10 to-[#700100]/5 rounded-bl-full -z-0"></div>
                      
                      <div className="h-16 flex items-center justify-center mb-4 relative z-10">
                        <img
                          src={supplier.logo}
                          alt={supplier.name}
                          className="h-12 w-auto object-contain transition-all duration-300"
                        />
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-[#700100] font-semibold text-lg mb-2">{supplier.name}</h3>
                        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('resellers.official_partner')}</span>
                          <a 
                            href="#" 
                            className="text-sm font-medium text-[#96cc39] hover:text-[#700100] flex items-center transition-colors"
                          >
                            <span>{t('resellers.learn_more')}</span>
                            <ExternalLink className="ml-1 w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white text-gray-800 shadow-lg hover:bg-gray-100 hover:text-gray-800" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white text-gray-800 shadow-lg hover:bg-gray-100 hover:text-gray-800" />
            </Carousel>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
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
      </div>
    </div>
  );
};

export default PartnersSection;
