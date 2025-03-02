import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const flags = ['🇹🇳', '🇩🇪', '🇫🇷', '🇺🇸'];

const ViewersNotification = () => {
  const [viewers, setViewers] = useState(3);
  const [currentFlag, setCurrentFlag] = useState('🇹🇳');
  const { i18n } = useTranslation(); // Only use this to get the current language

  useEffect(() => {
    // Update viewers count every 2 minutes
    const viewersInterval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 6) + 3);
    }, 120000);

    const flagInterval = setInterval(() => {
      const randomFlag = flags[Math.floor(Math.random() * flags.length)];
      setCurrentFlag(randomFlag);
    }, 30000);

    return () => {
      clearInterval(viewersInterval);
      clearInterval(flagInterval);
    };
  }, []);

  // Define hardcoded translations
  const getMessage = (language) => {
    switch (language) {
      case 'en':
        return `${viewers}`;
      case 'fr':
        return `${viewers}`;
      case 'de':
        return `${viewers}`;
      case 'ar':
        return `${viewers}`;
      default:
        return `${viewers}`;
    }
  };

  const language = i18n.language;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <div className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-blue-500/30 shadow-lg flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
        <div className="relative">
          <Users className="h-5 w-5 text-blue-400" />
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium flex items-center gap-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <span>{getMessage(language)}</span>
          <span className="text-lg">{currentFlag}</span>
        </span>
      </div>
    </div>
  );
};

export default ViewersNotification;
