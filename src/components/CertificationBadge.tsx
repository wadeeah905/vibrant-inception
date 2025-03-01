
import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
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
      className="fixed bottom-20 right-4 z-50 flex items-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <motion.div
        className={`rounded-lg shadow-lg bg-white flex items-center ${
          isExpanded ? 'pr-4' : ''
        }`}
        animate={{ width: isExpanded ? 'auto' : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative flex items-center justify-center p-2 rounded-lg group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/goldcertif.png" 
            alt="Certification Or" 
            className="w-12 h-12 object-contain"
          />
          {!isExpanded && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="ml-1 flex flex-col"
          >
            <p className="text-sm font-medium text-gray-900">Produits Certifiés</p>
            <p className="text-xs text-gray-600">Qualité Premium</p>
            <button 
              className="text-xs text-gray-500 mt-1 self-end"
              onClick={() => setIsVisible(false)}
            >
              Masquer
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CertificationBadge;
