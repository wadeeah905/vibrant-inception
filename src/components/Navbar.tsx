
import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Youtube, Phone, Mail, MapPin, Building2, Users, ChevronDown } from 'lucide-react';
import type { ClientType, NavItem, Language, ProductCategory } from '../types';
import ProductsDropdown from './ProductsDropdown';

interface NavbarProps {
  clientType: ClientType;
  currentPage: string;
  onPageChange: (page: string, category?: ProductCategory) => void;
  onClientTypeChange: (type: ClientType) => void;
}

const B2C_ITEMS: NavItem[] = [
  { label: 'Accueil', href: 'home' },
  { label: 'À propos', href: 'about' },
  { label: 'Nos Revendeurs', href: 'resellers' },
  { label: 'Nos Certifications', href: 'certifications' },
  { label: 'Contact', href: 'contact' },
];

const B2B_ITEMS: NavItem[] = B2C_ITEMS.filter(item => item.label !== 'Nos Revendeurs');

const PRODUCT_ITEMS = [
  {
    label: "Dattes",
    items: [
      { label: "Coffret Cadeaux", href: "products", category: "coffret-cadeaux" as ProductCategory },
      { label: "Paquets", href: "products", category: "paquets" as ProductCategory },
      { label: "Dattes en Vrac", href: "products", category: "dattes-en-vrac" as ProductCategory }
    ]
  },
  {
    label: "Figues Séchées",
    items: [
      { label: "Coffrets en Bois", href: "products", category: "coffrets-en-bois" as ProductCategory },
      { label: "Figues Séchées à l'Huile d'Olive", href: "products", category: "figues-sechees-huile-olive" as ProductCategory },
      { label: "Figues Séchées en Vrac", href: "products", category: "figues-sechees-en-vrac" as ProductCategory }
    ]
  },
  {
    label: "Sirops de Fruits",
    items: [
      { label: "Sirop de Dattes", href: "products", category: "sirop-dattes" as ProductCategory },
      { label: "Sirop de Figues Séchées", href: "products", category: "sirop-figues" as ProductCategory }
    ]
  },
  {
    label: "Sucre de Dattes",
    items: [
      { label: "Sucre de Dattes", href: "products", category: "sucre-dattes" as ProductCategory }
    ]
  }
];

const Navbar = ({ clientType, currentPage, onPageChange, onClientTypeChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('fr');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  
  const navItems = clientType === 'B2B' ? B2B_ITEMS : B2C_ITEMS;

  // Check if the current page is the home page (either explicitly 'home' or default '')
  const isHomePage = currentPage === 'home' || currentPage === '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, e: React.MouseEvent, category?: ProductCategory) => {
    e.preventDefault();
    onPageChange(href, category);
    setIsOpen(false);
    setIsMobileProductsOpen(false);
  };

  const ClientTypeSwitcher = () => (
    <div className="flex items-center bg-white/5 rounded-full p-0.5 shadow-sm border border-white/10">
      <button
        onClick={() => onClientTypeChange('B2C')}
        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          clientType === 'B2C' 
            ? 'bg-[#96cc39]/90 text-white shadow-sm' 
            : 'text-white/80 hover:text-[#96cc39] hover:bg-white/5'
        }`}
      >
        <Users size={12} className="mr-1" />
        B2C
      </button>
      <button
        onClick={() => onClientTypeChange('B2B')}
        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          clientType === 'B2B' 
            ? 'bg-[#96cc39]/90 text-white shadow-sm' 
            : 'text-white/80 hover:text-[#96cc39] hover:bg-white/5'
        }`}
      >
        <Building2 size={12} className="mr-1" />
        B2B
      </button>
    </div>
  );

  const LanguageSwitcher = () => (
    <button
      onClick={() => setLanguage(lang => lang === 'en' ? 'fr' : 'en')}
      className="text-sm font-medium transition-all duration-300 hover:text-[#96cc39]"
    >
      <img 
        src={language === 'fr' ? '../languages/fr.jpg' : '../languages/en.jpg'} 
        alt="Language Flag" 
        width={30} 
        height={40} 
      />
    </button>
  );
  
  return (
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="bg-[#64381b] text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center h-12">
            <div className="hidden lg:flex items-center space-x-6 mr-auto">
              <a href="tel:+21612345678" className="flex items-center space-x-2 text-sm hover:text-[#96cc39] transition-colors">
                <Phone size={14} />
                <span>+216 12 345 678</span>
              </a>
              <a href="mailto:contact@tazart.tn" className="flex items-center space-x-2 text-sm hover:text-[#96cc39] transition-colors">
                <Mail size={14} />
                <span>contact@tazart.tn</span>
              </a>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin size={14} />
                <span>Ben Arous, Tunisia</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <a href="#" className="hover:text-[#96cc39] transition-all duration-300 hover:scale-110">
                  <Instagram size={16} />
                </a>
                <a href="#" className="hover:text-[#96cc39] transition-all duration-300 hover:scale-110">
                  <Facebook size={16} />
                </a>
                <a href="#" className="hover:text-[#96cc39] transition-all duration-300 hover:scale-110">
                  <Youtube size={16} />
                </a>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <ClientTypeSwitcher />
              <div className="h-4 w-px bg-white/20" />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden mr-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#96cc39] hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <a href="#" onClick={(e) => handleNavClick('home', e)} className="flex items-center ml-[-12%]">
              <img
                src="https://i.ibb.co/KxkCnFLR/logo-tazart-page-0001-removebg-preview.png"
                alt="Logo"
                className="h-20 w-auto"
              />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              onClick={(e) => handleNavClick('home', e)}
              className={`text-gray-700 transition-all duration-300 font-medium relative group py-2
                ${isHomePage ? 'text-[#96cc39]' : 'hover:text-[#96cc39]'}`}
            >
              Accueil
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#96cc39] transform transition-transform origin-left
                ${isHomePage ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </a>
            
            <ProductsDropdown onPageChange={onPageChange} />
            
            {navItems.slice(1).map((item) => (
              <a
                key={item.href}
                href="#"
                onClick={(e) => handleNavClick(item.href, e)}
                className={`text-gray-700 transition-all duration-300 font-medium relative group py-2
                  ${currentPage === item.href ? 'text-[#96cc39]' : 'hover:text-[#96cc39]'}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#96cc39] transform transition-transform origin-left
                  ${currentPage === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
            ))}
          </div>
        </nav>

        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } z-40`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <img
                src="https://i.ibb.co/KxkCnFLR/logo-tazart-page-0001-removebg-preview.png"
                alt="Logo"
                className="h-12 w-auto"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#96cc39] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <a
                href="#"
                onClick={(e) => handleNavClick('home', e)}
                className={`block text-lg font-medium transition-colors
                  ${isHomePage ? 'text-[#96cc39]' : 'text-gray-700 hover:text-[#96cc39]'}`}
              >
                Accueil
              </a>

              <div className="relative">
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-[#96cc39] transition-colors"
                >
                  Produits
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {isMobileProductsOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {PRODUCT_ITEMS.map((category) => (
                      <div key={category.label} className="space-y-2">
                        <div className="font-medium text-gray-600">{category.label}</div>
                        {category.items.map((item) => (
                          <a
                            key={item.label}
                            href="#"
                            onClick={(e) => handleNavClick(item.href, e, item.category)}
                            className="block pl-4 text-gray-700 hover:text-[#96cc39] transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {navItems.slice(1).map((item) => (
                <a
                  key={item.href}
                  href="#"
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`block text-lg font-medium transition-colors
                    ${currentPage === item.href ? 'text-[#96cc39]' : 'text-gray-700 hover:text-[#96cc39]'}`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-auto">
              <div className="space-y-4 mb-6">
                <a href="tel:+21612345678" className="flex items-center space-x-3 text-gray-600 hover:text-[#96cc39] transition-colors">
                  <Phone size={18} />
                  <span>+216 12 345 678</span>
                </a>
                <a href="mailto:contact@example.com" className="flex items-center space-x-3 text-gray-600 hover:text-[#96cc39] transition-colors">
                  <Mail size={18} />
                  <span>contact@example.com</span>
                </a>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin size={18} />
                  <span>Ben Arous, Tunisia</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#96cc39] hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#96cc39] hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#96cc39] hover:text-white transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
