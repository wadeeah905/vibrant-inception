import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Github, Linkedin, Globe } from 'lucide-react';

const Navbarblog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇹🇳' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    setIsLangMenuOpen(false);
  };

  const navItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'about', label: t('nav.about') },
    { key: 'portfolio', label: t('nav.portfolio') },
    { key: 'services', label: t('nav.services') },
    { key: 'contact', label: t('nav.contact') }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Iheb Chebbi
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={`https://ihebchebbi.pro/`}
                  className="text-gray-300 hover:text-blue-400 transition-colors px-3 py-2 text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm">{languages.find(lang => lang.code === i18n.language)?.flag}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${
                          i18n.language === lang.code ? 'text-blue-400 bg-gray-800' : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="https://github.com/ihebchebbi1998tn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/chebbi-iheb/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-md">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`https://ihebchebbi.pro/`}
              className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          {/* Language selector for mobile */}
          <div className="px-3 py-2 border-t border-gray-800 mt-2">
            <p className="text-sm text-gray-400 mb-2">{t('common.selectLanguage')}</p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    i18n.language === lang.code ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbarblog;