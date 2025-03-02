import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇹🇳', dir: 'rtl' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<Props> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLanguageChange = async (langCode: string) => {
    setIsLoading(true);
    try {
      await i18n.changeLanguage(langCode);
      // Update document direction for RTL languages
      document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error changing language:', error);
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gray-900 border border-blue-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4" />
                <p className="text-white text-lg">Loading...</p>
              </div>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Select Language</h2>

                <div className="grid grid-cols-2 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all
                        ${i18n.language === lang.code
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      dir={lang.dir}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageSelector;