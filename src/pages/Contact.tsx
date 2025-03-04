
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import ParallaxText from '../components/ParallaxText';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  
  const banner = {
    image: '"/lovable-uploads/6bd6cb68-f12b-49b9-ad02-0d390070b4bc.png"',
    title: 'Digital',
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated coordinates for Carthage, Tunisia
  const coordinates: [number, number] = [36.8529, 10.3279];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: coordinates,
      zoom: 13, // Increased zoom level for better visibility
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true
    });

    // Updated to a more neutral, gray map style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map.current);

    // Custom marker icon with gray colors
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: #403E43;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          border: 2px solid #8E9196;
        ">
          <div style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background-color: #403E43;
            border-right: 2px solid #8E9196;
            border-bottom: 2px solid #8E9196;
          "></div>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    const marker = L.marker(coordinates, { icon: customIcon })
      .addTo(map.current)
      .bindPopup('<b>📍 Carthage, Tunisie</b>', {
        className: 'custom-popup'
      });

    setTimeout(() => marker.openPopup(), 1000);

    // Add custom CSS for the popup
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        background-color: #403E43;
        color: white;
        border: 1px solid #8E9196;
      }
      .custom-popup .leaflet-popup-tip {
        background-color: #403E43;
        border: 1px solid #8E9196;
      }
    `;
    document.head.appendChild(style);

    return () => {
      map.current?.remove();
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="pt-16 bg-[#222222]"> 
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#222222]/90 via-[#222222]/80 to-[#222222]/95" />
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale"
            style={{ backgroundImage: `url(${banner.image})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#222222_100%)] opacity-70" />
        </motion.div>
        
        <ParallaxText y={[0, -100]}>
          <div className="relative text-center px-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="w-20 h-1 bg-gradient-to-r from-[#8E9196] to-[#C8C8C9] mx-auto rounded-full mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold mb-3 text-[#F6F6F7]">
                Contactez-<span className="text-gold-500">nous</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-[#C8C8C9] to-[#8E9196] mx-auto rounded-full mt-4" />
            </motion.div>
          </div>
        </ParallaxText>
      </div>

      <div className="py-12 px-4 bg-gradient-to-b from-black to-rich-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border border-gold-500/5">
                  <h2 className="text-2xl font-bold mb-6 text-gold-400">Informations de Contact</h2>
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <Mail className="h-6 w-6 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gold-400">Email</p>
                        <a href="mailto:vilartprod@gmail.com" className="text-gray-400 hover:text-gold-400 transition-colors">
                          vilartprod@gmail.com
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <Phone className="h-6 w-6 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gold-400">Téléphone</p>
                        <a href="tel:+21654754704" className="text-gray-400 hover:text-gold-400 transition-colors">
                          +216 54 754 704
                        </a>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                        <MapPin className="h-6 w-6 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gold-400">Adresse</p>
                        <p className="text-gray-400">Tunis, Tunisie</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative bg-black/80 backdrop-blur-xl rounded-lg border border-gold-500/5 overflow-hidden">
                  <div ref={mapContainer} className="h-[300px] w-full" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-lg border border-gold-500/5">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gold-400">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gold-400">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gold-400">
                        Sujet
                      </label>
                      <select
                        id="subject"
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white"
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="production">Production Musicale</option>
                        <option value="events">Organisation d'Événements</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-gold-400">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className="w-full px-4 py-3 bg-black/50 border border-gold-500/10 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors text-white resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-3 bg-gradient-to-r relative overflow-hidden ${
                        isSubmitted ? 'from-green-600 to-green-500' : 'from-gold-600 to-gold-500'
                      } text-black font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-300`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white"
                        initial={false}
                        animate={isSubmitting ? { x: "100%" } : { x: "-100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="relative flex items-center justify-center space-x-2"
                        animate={isSubmitted ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Envoi en cours...</span>
                          </>
                        ) : isSubmitted ? (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Message Envoyé!</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Envoyer le Message</span>
                          </>
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
