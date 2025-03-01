
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const MadeInTunisia = () => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-playfair text-[#700100]">
          100% Made in Tunisia
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Nos dattes sont cultivées avec amour dans les oasis tunisiennes, 
          où le climat unique et le savoir-faire traditionnel se combinent 
          pour produire des fruits d'une qualité exceptionnelle. Chaque datte 
          est soigneusement sélectionnée et conditionnée pour préserver sa 
          fraîcheur et son goût authentique.
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
            Cultivé en Tunisie
          </span>
          <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
            Qualité Premium
          </span>
          <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
            Savoir-faire Traditionnel
          </span>
        </div>
      </div>
      <div className="relative w-full h-[400px] perspective">
        <div className="absolute -inset-1 rounded-2xl transform rotate-3"></div>
        <img
          src="/MadeInTunisia.png"
          alt="Made in Tunisia"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl preserve-3d translate-z-0"
        />
        
        {/* Interactive Dot Circle */}
        <div 
          className="absolute left-[40%] top-[47%] w-8 h-8 rounded-full bg-[#64381b] shadow-lg cursor-pointer z-10 flex items-center justify-center transform transition-all duration-300 hover:scale-110 group"
          onClick={toggleInfo}
          onMouseEnter={() => setIsInfoVisible(true)}
          onMouseLeave={() => setIsInfoVisible(false)}
        >
          <MapPin className="w-4 h-4 text-white" />
          <span className="absolute -bottom-1 left-1/2 w-2 h-2 bg-[#64381b] transform -translate-x-1/2 rotate-45"></span>
          
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-[#64381b] opacity-70 animate-ping"></span>
        </div>
        
        {/* Information Box - Responsive positioning */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ 
            opacity: isInfoVisible ? 1 : 0,
            scale: isInfoVisible ? 1 : 0.8,
            y: isInfoVisible ? 0 : -10
          }}
          transition={{ duration: 0.2 }}
          className={`absolute bg-white rounded-lg shadow-xl p-4 preserve-3d translate-z-2 pointer-events-none z-20 ${
            isMobile 
              ? 'w-[90%] left-[5%] top-[50%] transform -translate-y-1/2' // Center on mobile
              : 'w-[280px] left-[calc(20%-100px)] top-[calc(15%+45px)]' // Original position on desktop
          }`}
        >
          <div className="flex items-start mb-2">
            <div className="w-10 h-10 rounded-full bg-[#F9F4E8] flex items-center justify-center mr-3 flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#64381b]" />
            </div>
            <h3 className="text-lg font-semibold text-[#700100]">Région de Douz</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Située dans le sud de la Tunisie, Douz est connue comme "la porte du désert" et produit les meilleures dattes au monde grâce à son climat aride unique et son savoir-faire ancestral.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-[#F9F4E8] text-[#64381b] rounded-full">
              Climat optimal
            </span>
            <span className="text-xs px-2 py-1 bg-[#F9F4E8] text-[#64381b] rounded-full">
              Tradition séculaire
            </span>
            <span className="text-xs px-2 py-1 bg-[#F9F4E8] text-[#64381b] rounded-full">
              Dattes Deglet Nour
            </span>
          </div>
          
          <div className="text-xs text-gray-500 italic">
            Célèbre pour ses palmiers dattiers qui produisent des fruits d'une douceur et qualité incomparables.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MadeInTunisia;
