
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
        className={`rounded-l-lg shadow-lg bg-white flex items-center ${
          isExpanded ? 'pl-4' : ''
        } border border-gray-200`}
        animate={{ width: isExpanded ? 'auto' : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mr-1 flex flex-col"
          >
            <p className="text-sm font-medium text-gray-900">Produits Certifiés</p>
            <p className="text-xs text-gray-600">Qualité Premium</p>
            <button 
              className="text-xs text-gray-500 mt-1 self-start"
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
