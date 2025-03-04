
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "/lovable-uploads/270326f0-4113-41c1-8c99-3fe3d9523535.png",
  },
  {
    id: 2,
    image: "/lovable-uploads/4729d1f8-4b29-4042-8cfc-094123067c1f.png",
  },
  {
    id: 3,
    image: "/lovable-uploads/e2ab0179-7651-4901-b155-273451546398.png",
  }
];

const HeroButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full 
               transition-all duration-500 ease-out hover:scale-110 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]
               hover:-translate-y-1"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#E2B53E] to-[#B8860B] animate-gradient"></span>
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                     bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
                     from-[#FFD700] via-[#DAA520] to-[#B8860B]"></span>
    <span className="relative inline-flex items-center gap-3 rounded-full 
                     bg-black/90 px-8 py-3.5 text-sm font-medium tracking-wider
                     transition-all duration-500 group-hover:bg-transparent border border-[#B8860B]/20
                     group-hover:border-[#FFD700]/50">
      <span className="text-transparent bg-gradient-to-r from-[#FFD700] via-[#E2B53E] to-[#B8860B] 
                      bg-clip-text font-semibold group-hover:text-white transition-colors duration-500">
        {children}
      </span>
      <ArrowRight className="h-4 w-4 transform transition-transform duration-500 
                            group-hover:translate-x-1 text-[#E2B53E] group-hover:text-white" />
    </span>
    <span className="absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-[#FFD700]/30 
                     via-[#E2B53E]/30 to-[#B8860B]/30 opacity-0 group-hover:opacity-100 
                     transition-opacity duration-500"></span>
  </Link>
);

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 7000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 70);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].image})`,
              filter: 'brightness(0.4)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
          
          <div className="relative h-full flex flex-col items-center justify-center text-center z-10 px-4">
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group"
              >
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#FFD700]/20 to-[#B8860B]/20 
                              group-hover:from-[#FFD700]/30 group-hover:to-[#B8860B]/30 transition-all duration-500" />
                <img 
                  src="https://i.ibb.co/JRtvDcgK/image-removebg-preview-3.png"
                  alt="Logo"
                  className="w-80 md:w-96 relative transform transition-all duration-500 
                           hover:scale-105 drop-shadow-[0_0_25px_rgba(212,175,55,0.3)]
                           group-hover:drop-shadow-[0_0_35px_rgba(212,175,55,0.4)]"
                />
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <HeroButton to="/prod">
                  Production
                </HeroButton>
                <HeroButton to="/events">
                  Événementiel
                </HeroButton>
                <HeroButton to="/digital">
                  Digital
                </HeroButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-8 z-20">
        <div className="bg-white/20 w-32 h-1 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FFD700] via-[#E2B53E] to-[#B8860B]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="text-[#E2B53E] text-sm mt-2 font-medium tracking-wider">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
