
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
    >
      <div className="relative">
        <div className="h-24 w-24">
          <motion.span 
            className="absolute h-full w-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-cyan-500 border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.span 
            className="absolute h-full w-full rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-cyan-400"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="/lovable-uploads/27382b43-718a-49bc-9d43-a3299d6f67db.png"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
