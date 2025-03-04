
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if the current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-rich-black py-4 fixed top-0 left-0 w-full z-40">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-off-white">
          <img 
            src="https://i.ibb.co/JRtvDcgK/image-removebg-preview-3.png"
            alt="Vilart Logo" 
            className="h-10 w-auto"
          />
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className={`hover:text-gold-500 transition-colors relative ${isActive('/') ? 'text-gold-500' : ''}`}
          >
            Accueil
            {isActive('/') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
          <Link 
            to="/prod" 
            className={`hover:text-gold-500 transition-colors relative ${isActive('/prod') ? 'text-gold-500' : ''}`}
          >
            Production
            {isActive('/prod') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
          <Link 
            to="/digital" 
            className={`hover:text-gold-500 transition-colors relative ${isActive('/digital') ? 'text-gold-500' : ''}`}
          >
            Digital
            {isActive('/digital') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
          <Link 
            to="/events" 
            className={`hover:text-gold-500 transition-colors relative ${isActive('/events') ? 'text-gold-500' : ''}`}
          >
            Évènementiel
            {isActive('/events') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
          <Link 
            to="/about" 
            className={`hover:text-gold-500 transition-colors relative ${isActive('/about') ? 'text-gold-500' : ''}`}
          >
            À Propos
            {isActive('/about') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
          <Link 
            to="/contact" 
            className={`hover:text-gold-500 transition-colors relative ${isActive('/contact') ? 'text-gold-500' : ''}`}
          >
            Contact
            {isActive('/contact') && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-off-white focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden absolute top-full left-0 w-full bg-rich-black z-30 ${
          isOpen ? 'block' : 'hidden'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-4 py-6 flex flex-col space-y-4">
          <Link 
            to="/" 
            className={`hover:text-gold-500 transition-colors block py-2 relative ${isActive('/') ? 'text-gold-500 pl-3' : ''}`} 
            onClick={toggleMenu}
          >
            {isActive('/') && (
              <div className="absolute left-0 top-0 w-[3px] h-full bg-gold-500" />
            )}
            Accueil
          </Link>
          <Link 
            to="/prod" 
            className={`hover:text-gold-500 transition-colors block py-2 relative ${isActive('/prod') ? 'text-gold-500 pl-3' : ''}`} 
            onClick={toggleMenu}
          >
            {isActive('/prod') && (
              <div className="absolute left-0 top-0 w-[3px] h-full bg-gold-500" />
            )}
            Production
          </Link>
          <Link 
            to="/digital" 
            className={`hover:text-gold-500 transition-colors block py-2 relative ${isActive('/digital') ? 'text-gold-500 pl-3' : ''}`} 
            onClick={toggleMenu}
          >
            {isActive('/digital') && (
              <div className="absolute left-0 top-0 w-[3px] h-full bg-gold-500" />
            )}
            Digital
          </Link>
          <Link 
            to="/events" 
            className={`hover:text-gold-500 transition-colors block py-2 relative ${isActive('/events') ? 'text-gold-500 pl-3' : ''}`} 
            onClick={toggleMenu}
          >
            {isActive('/events') && (
              <div className="absolute left-0 top-0 w-[3px] h-full bg-gold-500" />
            )}
            Évènementiel
          </Link>
          <Link 
            to="/about" 
            className={`hover:text-gold-500 transition-colors block py-2 relative ${isActive('/about') ? 'text-gold-500 pl-3' : ''}`} 
            onClick={toggleMenu}
          >
            {isActive('/about') && (
              <div className="absolute left-0 top-0 w-[3px] h-full bg-gold-500" />
            )}
            À Propos
          </Link>
          <Link 
            to="/contact" 
            className={`hover:text-gold-500 transition-colors block py-2 relative ${isActive('/contact') ? 'text-gold-500 pl-3' : ''}`} 
            onClick={toggleMenu}
          >
            {isActive('/contact') && (
              <div className="absolute left-0 top-0 w-[3px] h-full bg-gold-500" />
            )}
            Contact
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
