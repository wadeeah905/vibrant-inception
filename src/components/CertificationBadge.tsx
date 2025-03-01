
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle } from 'lucide-react';

const CertificationBadge = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-collapse after 5 seconds if expanded
    let timeout: NodeJS.Timeout;
    if (isExpanded) {
      timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isExpanded]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-20 md:top-24 right-0 z-50"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <motion.div
        className={`rounded-l-lg shadow-lg border-l-4 border-l-purple-600 bg-white flex items-center ${
          isExpanded ? 'pl-4' : ''
        } border-y border-l border-gray-200`}
        animate={{ width: isExpanded ? 'auto' : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mr-3 flex flex-col"
          >
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-purple-600 mr-1" />
              <p className="text-sm font-bold text-gray-900">Produits Certifiés</p>
            </div>
            <div className="flex items-center mt-1">
              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
              <p className="text-xs text-gray-600">Qualité Premium</p>
            </div>
            <div className="flex items-center mt-1">
              <Award className="w-3 h-3 text-amber-500 mr-1" />
              <p className="text-xs text-gray-600">Standards Internationaux</p>
            </div>
            <button 
              className="text-xs text-purple-600 hover:text-purple-800 mt-2 self-start font-medium"
              onClick={() => setIsVisible(false)}
            >
              Masquer
            </button>
          </motion.div>
        )}
        
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative flex items-center justify-center p-2 rounded-lg group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full animate-pulse" />
          <img 
            src="/goldcertif.png" 
            alt="Certification Or" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CertificationBadge;
