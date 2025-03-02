import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, X, Minimize2, Maximize2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ServiceOptions from './ServiceOptions';
import PastExperiencePreview from './PastExperiencePreview';
import RecentProjectsPreview from './RecentProjectsPreview';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
  component?: React.ReactNode;
}

const ChatAssistant = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: 'welcome',
            type: 'bot',
            content: t('chat.welcome'),
            options: [
              t('chat.options.about'),
              t('chat.options.projects'),
              t('chat.options.collaboration'),
              t('chat.options.hiring')
            ]
          }
        ]);
      }, 500);
    }
  }, [isOpen, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = () => {
    switch (i18n.language) {
      case 'fr':
        return 'Bonjour! 👋';
      case 'de':
        return 'Hallo! 👋';
      case 'ar':
        return 'مرحباً! 👋';
      default:
        return 'Hello! 👋';
    }
  };

  const handleOptionClick = (option: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: option }]);

    setTimeout(() => {
      let response: Message;

      switch (option) {
        case t('chat.options.about'):
          response = {
            id: Date.now().toString(),
            type: 'bot',
            content: t('chat.responses.about'),
            options: [t('chat.options.projects'), t('chat.options.collaboration')]
          };
          break;

        case t('chat.options.projects'):
          response = {
            id: Date.now().toString(),
            type: 'bot',
            content: t('chat.responses.projects'),
            component: <RecentProjectsPreview />,
            options: [t('chat.options.collaboration'), t('chat.options.hiring')]
          };
          break;

        case t('chat.options.collaboration'):
          response = {
            id: Date.now().toString(),
            type: 'bot',
            content: t('chat.responses.collaboration'),
            component: <ServiceOptions />
          };
          break;

        case t('chat.options.hiring'):
          response = {
            id: Date.now().toString(),
            type: 'bot',
            content: t('chat.responses.hiring'),
            component: <PastExperiencePreview />
          };
          break;

        default:
          response = {
            id: Date.now().toString(),
            type: 'bot',
            content: t('chat.responses.default'),
            options: [
              t('chat.options.about'),
              t('chat.options.projects'),
              t('chat.options.collaboration')
            ]
          };
      }

      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse = {
        id: Date.now().toString(),
        type: 'bot' as const,
        content: t('chat.responses.default'),
        options: [
          t('chat.options.about'),
          t('chat.options.projects'),
          t('chat.options.collaboration')
        ]
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showWelcomePopup && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg"
            >
              <div className="text-lg font-semibold">{getWelcomeMessage()}</div>
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-4 h-4 bg-blue-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            setIsOpen(true);
            setShowWelcomePopup(false);
          }}
          className={`${
            isOpen ? 'hidden' : 'flex'
          } items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg`}
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:inline">{t('chat.startChat')}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`${isMinimized ? 'w-auto' : 'w-[95%] sm:w-[380px] md:w-[420px]'}`}
            >
              <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-white">Iheb AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {isMinimized ? (
                        <Maximize2 className="h-4 w-4" />
                      ) : (
                        <Minimize2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {!isMinimized && (
                  <>
                    <div className="p-4 h-[400px] overflow-y-auto space-y-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          type={message.type}
                          content={message.content}
                          options={message.options}
                          onOptionClick={handleOptionClick}
                          component={message.component}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={t('chat.inputPlaceholder')}
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ChatAssistant;