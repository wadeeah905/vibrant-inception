
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2, Heart, ThumbsUp, Smile } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const BEN_AROUS_POSITION: [number, number] = [36.7533, 10.2222];

const BUSINESS_HOURS = [
  { day: 'Lundi - Vendredi', hours: '8h30 - 18h30', isOpen: true },
  { day: 'Samedi', hours: '9h00 - 13h00', isOpen: true },
  { day: 'Dimanche', hours: 'Fermé', isOpen: false },
];

export const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) errors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
    else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }
    if (!formData.message.trim()) errors.message = 'Le message est requis';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowThankYou(true);
    
    // Reset the form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setFormErrors({});
    
    // Hide the thank you message after 5 seconds
    setTimeout(() => {
      setTimeout(() => setShowThankYou(false), 500);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const thankYouIcons = [Heart, ThumbsUp, Smile, CheckCircle2];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-36 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div 
            className={`text-center mb-16 transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-playfair mb-4 text-gray-900 relative inline-block">
              Contactez-nous
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39] transform origin-left transition-transform duration-1000 delay-500 scale-x-100"></span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Notre équipe est à votre écoute pour répondre à toutes vos questions.
              N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: 'Téléphone',
                subtitle: 'Service client disponible',
                info: '+216 12 345 678',
                link: 'tel:+21612345678',
                color: '#96cc39',
                delay: 200,
              },
              {
                icon: Mail,
                title: 'Email',
                subtitle: 'Réponse sous 24h',
                info: 'contact@example.com',
                link: 'mailto:contact@example.com',
                color: '#64381b',
                delay: 400,
              },
              {
                icon: MapPin,
                title: 'Adresse',
                subtitle: 'Showroom & Bureau',
                info: 'Ben Arous, Tunisia',
                color: '#96cc39',
                delay: 600,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-500 transform hover:-translate-y-1 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <div className={`w-12 h-12 bg-opacity-10 rounded-full flex items-center justify-center mb-4`}
                     style={{ backgroundColor: `${item.color}20` }}>
                  <item.icon style={{ color: item.color }} />
                </div>
                <h3 className="font-playfair text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.subtitle}</p>
                {item.link ? (
                  <a
                    href={item.link}
                    className="hover:underline transition-colors"
                    style={{ color: item.color }}
                  >
                    {item.info}
                  </a>
                ) : (
                  <span style={{ color: item.color }}>{item.info}</span>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div 
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-700 transform h-full ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <h2 className="text-2xl font-playfair mb-6 flex items-center">
                <Send className="mr-3 text-[#96cc39]" />
                Envoyez-nous un message
              </h2>
              
              <AnimatePresence mode="wait">
                {showThankYou ? (
                  <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                    className="bg-[#96cc39]/10 rounded-xl p-6 text-center relative overflow-hidden"
                    style={{ minHeight: "400px" }}
                  >
                    <motion.div 
                      className="absolute inset-0 z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.05 }}
                    >
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          initial={{ 
                            x: Math.random() * 100 - 50 + "%", 
                            y: Math.random() * 100 + "%",
                            opacity: 0
                          }}
                          animate={{ 
                            y: [null, "-100%"],
                            opacity: [0, 1, 0],
                            rotate: Math.random() * 360
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 3 + Math.random() * 2,
                            delay: Math.random() * 2
                          }}
                        >
                          {React.createElement(
                            thankYouIcons[Math.floor(Math.random() * thankYouIcons.length)], 
                            { 
                              size: 12 + Math.floor(Math.random() * 14),
                              className: "text-[#96cc39]/30" 
                            }
                          )}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div 
                      className="relative z-10 flex flex-col items-center justify-center h-full"
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    >
                      <motion.div 
                        className="flex justify-center mb-6"
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="bg-[#96cc39] w-20 h-20 rounded-full flex items-center justify-center text-white">
                          <CheckCircle2 size={40} />
                        </div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-3xl font-semibold text-[#64381b] mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Merci Beaucoup !
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-600 text-lg max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="contact-form"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                          } focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all`}
                          placeholder="Votre prénom"
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                          } focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all`}
                          placeholder="Votre nom"
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.email ? 'border-red-300' : 'border-gray-300'
                          } focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all`}
                          placeholder="votre@email.com"
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.phone ? 'border-red-300' : 'border-gray-300'
                          } focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all`}
                          placeholder="+216 XX XXX XXX"
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Sujet
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all"
                        placeholder="Le sujet de votre message"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          formErrors.message ? 'border-red-300' : 'border-gray-300'
                        } focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all resize-none`}
                        placeholder="Votre message..."
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#96cc39] to-[#7ba32f] text-white font-medium
                        flex items-center justify-center space-x-2
                        transform transition-all duration-300
                        ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:translate-y-[-2px] hover:shadow-lg'}
                      `}
                    >
                      <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                      <Send size={18} className={isSubmitting ? 'animate-pulse' : ''} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Map & Hours Container */}
            <div 
              className={`space-y-6 transition-all duration-700 transform h-full flex flex-col ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              {/* Map */}
              <div className="bg-white rounded-xl p-8 shadow-lg flex-1">
                <h2 className="text-2xl font-playfair mb-6 flex items-center">
                  <MapPin className="mr-3 text-[#96cc39]" />
                  Notre localisation
                </h2>
                
                <div className="h-[300px] w-full rounded-lg overflow-hidden shadow-inner relative z-10">
                  <MapContainer 
                    center={BEN_AROUS_POSITION} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={BEN_AROUS_POSITION}>
                      <Popup>
                        <div className="font-medium">Premium Dates</div>
                        <div className="text-sm text-gray-600">Ben Arous, Tunisia</div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-playfair mb-4 flex items-center">
                  <Clock className="mr-2 text-[#96cc39]" />
                  Heures d'ouverture
                </h2>

                <div className="space-y-2">
                  {BUSINESS_HOURS.map((schedule, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                        schedule.isOpen ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-medium">{schedule.day}</span>
                      <span
                        className={`text-sm ${
                          schedule.isOpen ? 'text-[#96cc39]' : 'text-gray-500'
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
