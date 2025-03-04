
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  useEffect(() => {
    // Trigger loading complete after animation
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-rich-black"
    >
      <div className="relative">
        {/* Animated circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -m-8 rounded-full border-2 border-gold-400/30"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -m-4 rounded-full border-2 border-gold-500/50"
        />
        
        {/* Logo container */}
        <motion.div
          animate={{
            scale: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <img 
            src="https://i.ibb.co/JRtvDcgK/image-removebg-preview-3.png"
            alt="Vilart Logo"
            className="h-32 w-auto"
          />
          
          {/* Gold glow effect */}
          <motion.div
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 blur-2xl bg-gold-500/20 -z-10"
          />
        </motion.div>

        {/* Loading text */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-gold-400/80 text-xs font-light tracking-wider"
        >
          CHARGEMENT...
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
