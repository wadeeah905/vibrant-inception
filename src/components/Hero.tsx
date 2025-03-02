
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { motion } from 'framer-motion';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const resumeFile = i18n.language === 'fr' ? '/resumefr.pdf' : '/resumeen.pdf';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#080b2d,#1e3a8a)] opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute -inset-[10px]">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="space-y-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-lg shadow-blue-500/20"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <img
              src="/lovable-uploads/27382b43-718a-49bc-9d43-a3299d6f67db.png"
              alt="Profile"
              className="w-full h-full object-cover relative z-10"
            />
          </motion.div>

          {/* Name and Role */}
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block text-white">Iheb Chebbi</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {t('hero.role')}
              </span>
            </motion.h1>

            <motion.p 
              className="max-w-2xl mx-auto text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t('hero.description')}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.a
              href="#portfolio"
              className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 
                       text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 
                       transition-all overflow-hidden transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.cta.portfolio')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>
            
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  className="group relative px-8 py-3 rounded-full border border-blue-500/50 
                           text-white font-semibold hover:bg-blue-900/30 transition-all 
                           overflow-hidden transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 animate-[spin_3s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="flex items-center gap-2">
                    {t('hero.cta.downloadcv')}
                    <FileDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-200" />
                  </span>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh] bg-gray-900 rounded-lg shadow-lg transition-all duration-300 p-4">
                <iframe
                  src={resumeFile}
                  className="w-full h-full rounded-lg shadow-lg border border-gray-700"
                  title="CV Preview"
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
