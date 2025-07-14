import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles, Camera, Paperclip, Plus } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent } from './dialog';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { Separator } from './separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { cartEventEmitter } from '@/contexts/CartContext';

interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  imageName?: string;
  isProductSuggestion?: boolean;
  products?: any[];
  isSystem?: boolean;
}

interface FloatingAssistantProps {
  onClose?: () => void;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  onClose
}) => {
  const { t } = useTranslation('chat');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    text: t('greeting'),
    isUser: false
  }]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(true);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [hasUserTypedDirectly, setHasUserTypedDirectly] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [agentsOnline, setAgentsOnline] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());
  
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>('');
  const pollMessagesIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetAutoCloseTimer = useCallback(() => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }
    
    setLastMessageTime(Date.now());
    
    if (!isConnectedToAgent && !isMobileModalOpen) {
      const timer = setTimeout(() => {
        const timeSinceLastMessage = Date.now() - lastMessageTime;
        if (timeSinceLastMessage >= 30000) {
          setIsOpen(false);
          setTimeout(() => setShowTooltip(true), 500);
        }
      }, 30000);
      setAutoCloseTimer(timer);
    }
  }, [isConnectedToAgent, isMobileModalOpen, lastMessageTime, autoCloseTimer]);

  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      const { item, action } = event.detail;
      if (action === 'add') {
        handleNewProductAdded(item);
      }
    };

    cartEventEmitter.addEventListener('cartUpdate', handleCartUpdate as EventListener);
    
    return () => {
      cartEventEmitter.removeEventListener('cartUpdate', handleCartUpdate as EventListener);
    };
  }, []);

  const handleNewProductAdded = async (item: any) => {
    setMessages(prev => [...prev, {
      text: t('productSuggestion.newItemAdded', { productName: item.name }),
      isUser: false
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: t('productSuggestion.suggestSimilar'),
        isUser: false
      }]);
    }, 1000);

    setTimeout(() => {
      fetchAndShowRelatedProducts(item.id);
    }, 2000);
  };

  const fetchAndShowRelatedProducts = async (productId: string) => {
    setLoadingSuggestions(true);
    
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/get_related_products.php?id_product=${productId}&limit=3`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setMessages(prev => [...prev, {
          text: t('productSuggestion.relatedProducts'),
          isUser: false,
          isProductSuggestion: true,
          products: data.data
        }]);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  const checkAgentStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('api/agent_status.php?action=count', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAgentsOnline(data.status === 'online');
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error checking agent status:', error);
      }
    }
  }, []);
  
  const isBusinessHours = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour < 17;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (!isMobile) {
        setIsOpen(true);
      }
      resetAutoCloseTimer();
    }, 4000);
    return () => clearTimeout(timer);
  }, [resetAutoCloseTimer, isMobile]);

  useEffect(() => {
    checkAgentStatus();
    
    if (isVisible && isBusinessHours()) {
      checkStatusIntervalRef.current = setInterval(checkAgentStatus, 60000);
    }
    
    return () => {
      if (checkStatusIntervalRef.current) {
        clearInterval(checkStatusIntervalRef.current);
      }
    };
  }, [isVisible, checkAgentStatus]);

  useEffect(() => {
    if (isConnectedToAgent && sessionId.current) {
      pollMessagesIntervalRef.current = setInterval(async () => {
        await pollForNewMessages();
      }, 3000);
    }

    return () => {
      if (pollMessagesIntervalRef.current) {
        clearInterval(pollMessagesIntervalRef.current);
      }
    };
  }, [isConnectedToAgent]);

  const pollForNewMessages = async () => {
    if (!sessionId.current) return;

    try {
      const response = await fetch(`api/chat_messages.php?session_id=${sessionId.current}&client_only=true`);
      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        const newAgentMessages = data.messages.filter((msg: any) => 
          msg.sender_type === 'agent' && 
          !messages.some(existingMsg => existingMsg.text === msg.message_content)
        );

        if (newAgentMessages.length > 0) {
          setMessages(prev => [
            ...prev,
            ...newAgentMessages.map((msg: any) => ({
              text: msg.message_content,
              isUser: false,
              imageUrl: msg.image_url ? `https://draminesaid.com/lucci/${msg.image_url}` : undefined,
              imageName: msg.image_name
            }))
          ]);
        }
      }
    } catch (error) {
      console.error('Error polling for messages:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert(t('errors.fileType'));
      return;
    }

    if (file.size > maxSize) {
      alert(t('errors.fileSize'));
      return;
    }

    setUploadingImage(true);
    resetAutoCloseTimer();

    try {
      const formData = new FormData();
      formData.append('image', file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('api/upload_chat_image.php', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          text: '',
          isUser: true,
          imageUrl: `https://draminesaid.com/lucci/${data.data.url}`,
          imageName: data.data.filename
        }]);

        await sendImageMessage(data.data.url, data.data.filename, data.data.size);
      } else {
        alert(data.error || t('errors.uploadError'));
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        alert(t('errors.uploadTimeout'));
      } else {
        console.error('Error uploading image:', error);
        alert(t('errors.uploadError'));
      }
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sendImageMessage = async (imageUrl: string, imageName: string, imageSize: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('api/chat_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId.current || 'floating_assistant_session',
          sender_type: 'client',
          sender_name: contactForm.name || 'Client',
          message_content: t('imageShared'),
          message_type: 'image',
          image_url: imageUrl,
          image_name: imageName,
          image_size: imageSize
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.success && !isConnectedToAgent) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: t('imageReceived'),
            isUser: false
          }]);
        }, 1000);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sending image message:', error);
      }
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (message.trim()) {
      setMessages(prev => [...prev, {
        text: message,
        isUser: true
      }]);
      const messageText = message;
      setMessage('');
      resetAutoCloseTimer();

      if (!hasUserTypedDirectly && showPredefinedQuestions) {
        setHasUserTypedDirectly(true);
        setShowPredefinedQuestions(false);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Merci pour votre message ! Pour mieux vous aider et vous connecter directement avec notre équipe, pourriez-vous remplir ce formulaire ?",
            isUser: false
          }]);
          setShowContactForm(true);
        }, 1000);
        return;
      }

      if (sessionId.current && contactForm.name) {
        await sendTextMessage(messageText);
      } else if (waitingForAgent || isConnectedToAgent) {
        setTimeout(() => {
          setShowContactForm(true);
          setMessages(prev => [...prev, {
            text: t('contactFormRequest'),
            isUser: false
          }]);
        }, 1000);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: t('defaultAnswer'),
            isUser: false
          }]);
        }, 1000);
      }
    }
  }, [message, t, contactForm.name, resetAutoCloseTimer, waitingForAgent, isConnectedToAgent, hasUserTypedDirectly, showPredefinedQuestions]);

  const sendTextMessage = async (messageText: string) => {
    try {
      const response = await fetch('api/chat_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId.current,
          sender_type: 'client',
          sender_name: contactForm.name || 'Client',
          message_content: messageText,
          message_type: 'text'
        }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const predefinedQuestions = [
    {
      id: 1,
      text: t('questions.delivery.text'),
      description: t('questions.delivery.description'),
      answer: t('questions.delivery.answer')
    },
    {
      id: 2,
      text: t('questions.pricing.text'),
      description: t('questions.pricing.description'),
      answer: t('questions.pricing.answer')
    },
    {
      id: 3,
      text: t('questions.appointment.text'),
      description: t('questions.appointment.description'),
      answer: t('questions.appointment.answer')
    },
    {
      id: 4,
      text: t('questions.sizing.text'),
      description: t('questions.sizing.description'),
      answer: t('questions.sizing.answer')
    },
    {
      id: 5,
      text: t('questions.advisor.text'),
      description: t('questions.advisor.description'),
      answer: t('questions.advisor.answer')
    }
  ];

  const handleContactSubmit = async () => {
    if (contactForm.name && contactForm.email && contactForm.phone) {
      try {
        const sessionResponse = await fetch('api/chat_sessions.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: contactForm.name,
            client_email: contactForm.email,
            client_phone: contactForm.phone
          }),
        });

        const sessionData = await sessionResponse.json();
        if (sessionData.success) {
          sessionId.current = sessionData.session_id;
        }

        setShowContactForm(false);
        setWaitingForAgent(false);
        setIsConnectedToAgent(true);
        setShowPredefinedQuestions(false);
        
        setMessages(prev => [...prev, {
          text: t('contactFormThank', { name: contactForm.name }),
          isUser: false
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Comment pouvons-nous vous aider aujourd'hui ?",
            isUser: false
          }]);
        }, 1000);
        
      } catch (error) {
        console.error('Error creating session:', error);
        setShowContactForm(false);
        setMessages(prev => [...prev, {
          text: t('contactFormThank', { name: contactForm.name }),
          isUser: false
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Comment pouvons-nous vous aider aujourd'hui ?",
            isUser: false
          }]);
        }, 1000);
      }
    }
  };

  const handleQuestionClick = (question: typeof predefinedQuestions[0]) => {
    setMessages(prev => [...prev, {
      text: question.text,
      isUser: true
    }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: question.answer,
        isUser: false
      }]);
    }, 1000);

    setShowPredefinedQuestions(false);
    resetAutoCloseTimer();
  };

  const handleTalkToAgent = () => {
    setWaitingForAgent(true);
    setShowPredefinedQuestions(false);
    setShowContactForm(true);
    
    setMessages(prev => [...prev, {
      text: "👨‍💼 Parler à un conseiller",
      isUser: true
    }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: t('contactFormRequest'),
        isUser: false
      }]);
    }, 1000);
  };

  const handleInputFocus = () => {
    resetAutoCloseTimer();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    if (isMobile && !isMobileModalOpen) {
      setIsMobileModalOpen(true);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleInputFocus();
  };

  const handleAgentConnection = () => {
    setIsConnectedToAgent(true);
    setShowPredefinedQuestions(false);
    
    setMessages([
      {
        text: "Parfait ! Vous êtes maintenant en contact avec l'un de nos conseillers. Votre conversation précédente a été effacée pour votre confidentialité.",
        isUser: false,
        isSystem: true
      }
    ]);

    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
      if (checkStatusIntervalRef.current) {
        clearInterval(checkStatusIntervalRef.current);
      }
      if (pollMessagesIntervalRef.current) {
        clearInterval(pollMessagesIntervalRef.current);
      }
    };
  }, [autoCloseTimer]);

  if (!isVisible) return null;

  const ChatContent = () => (
    <div className={cn(
      "bg-card border border-border rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm",
      isMobile ? "h-full flex flex-col" : ""
    )}>
      <div className="bg-gradient-to-r from-primary via-accent to-primary p-3 md:p-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
        <div className="flex items-center gap-2 md:gap-3 relative z-10">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-semibold block text-sm md:text-base">{t('assistantName')}</span>
            <span className="text-white/80 text-xs">
              {isConnectedToAgent ? "Agent connecté" : t('onlineNow')}
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setIsOpen(false);
            if (isMobile) {
              setIsMobileModalOpen(false);
            }
          }} 
          className="text-white hover:bg-white/20 h-7 w-7 md:h-8 md:w-8 p-0 relative z-10"
        >
          <X className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>
      
      <div className={cn(
        "overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-background to-muted/30",
        isMobile ? "flex-1 min-h-0" : "h-64 md:h-80"
      )}>
        {messages.map((msg, index) => (
          <div key={index} className={cn("flex gap-2 items-start", msg.isUser ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0", 
              msg.isUser ? "bg-primary text-primary-foreground" : 
              msg.isSystem ? "bg-green-500 text-white" :
              "bg-gradient-to-r from-accent to-primary text-white"
            )}>
              {msg.isUser ? <User className="w-3 h-3 md:w-4 md:h-4" /> : <Bot className="w-3 h-3 md:w-4 md:h-4" />}
            </div>
           <div className={cn("max-w-[80%] md:max-w-[75%] rounded-2xl text-xs md:text-sm shadow-sm", 
             msg.isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : 
             msg.isSystem ? "bg-green-50 text-green-800 border border-green-200 rounded-tl-sm" :
             "bg-white text-foreground border border-border rounded-tl-sm"
           )}>
               {msg.imageUrl ? (
                 <div className="p-2">
                   <img 
                     src={msg.imageUrl} 
                     alt={msg.imageName || t('imageShared')} 
                     className="max-w-full max-h-32 md:max-h-48 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                     onClick={() => window.open(msg.imageUrl, '_blank')}
                     loading="lazy"
                   />
                   {msg.text && <p className="mt-2 p-2">{msg.text}</p>}
                 </div>
               ) : msg.isProductSuggestion && msg.products ? (
                 <div className="p-2 md:p-3">
                   <p className="mb-2 md:mb-3">{msg.text}</p>
                   <div className="grid grid-cols-1 gap-2">
                     {msg.products.map((product: any) => (
                       <div key={product.id_product} className="flex gap-2 items-center p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                         <img 
                           src={`https://draminesaid.com/lucci/${product.img_product}`}
                           alt={product.nom_product}
                           className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                         />
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-medium truncate">{product.nom_product}</p>
                           <p className="text-xs text-muted-foreground">{product.price_product}€</p>
                         </div>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="text-xs px-2 py-1 h-auto"
                           onClick={() => window.open(`/product/${product.id_product}`, '_blank')}
                         >
                           {t('productSuggestion.viewProduct')}
                         </Button>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="p-2 md:p-3">{msg.text}</div>
               )}
             </div>
          </div>
        ))}

        {isConnectedToAgent && (
          <div className="flex items-center gap-2 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-green-600 font-medium px-2">Agent connecté</span>
            <Separator className="flex-1" />
          </div>
        )}

        {agentTyping && (
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-accent to-primary text-white">
              <Bot className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <div className="bg-white border rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {showContactForm && (
        <div className="p-3 md:p-4 border-t border-border bg-muted/50">
          <div className="space-y-2 md:space-y-3">
            <div>
              <Label htmlFor="name" className="text-xs font-medium">{t('form.fullName')}</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('form.fullNamePlaceholder')}
                className="mt-1 h-8 md:h-9 text-xs md:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs font-medium">{t('form.email')}</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('form.emailPlaceholder')}
                className="mt-1 h-8 md:h-9 text-xs md:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs font-medium">{t('form.phone')}</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('form.phonePlaceholder')}
                className="mt-1 h-8 md:h-9 text-xs md:text-sm"
              />
            </div>
            <Button 
              onClick={handleContactSubmit} 
              className="w-full h-8 md:h-9 text-xs md:text-sm bg-gradient-to-r from-primary to-accent"
              disabled={!contactForm.name || !contactForm.email || !contactForm.phone}
            >
              {t('form.send')}
            </Button>
          </div>
        </div>
      )}

      {showPredefinedQuestions && !isConnectedToAgent && !waitingForAgent && (
        <div className="p-2 md:p-3 border-t border-border bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">{t('frequentQuestions')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {predefinedQuestions.map((question) => (
              <Button
                key={question.id}
                onClick={() => handleQuestionClick(question)}
                variant="outline"
                size="sm"
                className="h-auto p-2 text-xs border-border hover:bg-accent/50 flex flex-col items-start text-left"
              >
                <div className="font-medium text-xs truncate w-full">{question.text}</div>
                <div className="text-muted-foreground text-xs mt-1 line-clamp-2 w-full">{question.description}</div>
              </Button>
            ))}
            
            <Button
              onClick={handleTalkToAgent}
              variant="default"
              size="sm"
              className="h-auto p-2 text-xs bg-primary hover:bg-primary/90 flex flex-col items-start text-left col-span-1 sm:col-span-2"
            >
              <div className="font-medium text-xs w-full">👨‍💼 Parler à un conseiller</div>
              <div className="text-primary-foreground/80 text-xs mt-1 w-full">Contact direct avec notre équipe</div>
            </Button>
          </div>
        </div>
      )}
      
      <div className="p-2 md:p-3 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="rounded-full w-8 h-8 md:w-9 md:h-9 p-0 hover:bg-accent/50 flex-shrink-0"
          >
            {uploadingImage ? (
              <div className="w-3 h-3 md:w-4 md:h-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <Camera className="w-3 h-3 md:w-4 md:h-4 text-accent" />
            )}
          </Button>
          <div className="flex-1 min-w-0 relative">
            <Textarea 
              ref={textareaRef}
              value={message} 
              onChange={(e) => {
                setMessage(e.target.value);
                resetAutoCloseTimer();
              }}
              onFocus={handleInputFocus}
              onClick={handleInputClick}
              onTouchStart={handleInputClick}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={t('writeMessage')} 
              rows={1}
              style={{ 
                minHeight: isMobile ? '36px' : '42px',
                maxHeight: isMobile ? '100px' : '120px',
                pointerEvents: 'auto',
                touchAction: 'manipulation'
              }}
              className={cn(
                "min-h-[36px] md:min-h-[42px] max-h-[100px] md:max-h-[120px] resize-none bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-xs md:text-sm cursor-text",
                isMobile ? "px-3 py-2 touch-manipulation" : "px-4 py-2.5"
              )} 
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim()}
            size="sm" 
            className="rounded-full w-8 h-8 md:w-9 md:h-9 p-0 bg-primary hover:bg-primary/90 shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Always visible floating button on mobile */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="relative">
            {showTooltip && !isMobileModalOpen && (
              <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 max-w-[200px]">
                {t('tooltip')}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
            <Button
              onClick={() => {
                setIsMobileModalOpen(true);
                setShowTooltip(false);
              }}
              size="lg"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </div>

        {/* Full screen modal on mobile */}
        <Dialog open={isMobileModalOpen} onOpenChange={setIsMobileModalOpen}>
          <DialogContent className="w-full h-full max-w-none max-h-none p-0 m-0 rounded-none border-0" style={{ touchAction: 'manipulation' }}>
            <div className="h-full w-full" style={{ touchAction: 'manipulation' }}>
              <ChatContent />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {isOpen ? (
          <div className="w-80 lg:w-96 h-[500px] lg:h-[600px]">
            <ChatContent />
          </div>
        ) : (
          <>
            {showTooltip && (
              <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                {t('tooltip')}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
            <Button
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
                resetAutoCloseTimer();
              }}
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
