import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Clock, 
  Mail, 
  Phone,
  Circle,
  Search,
  Wifi,
  WifiOff,
  Settings,
  MoreHorizontal,
  Paperclip,
  Smile,
  Archive,
  Star,
  CheckCheck,
  Check,
  ArrowLeft,
  Menu,
  X,
  ImageIcon,
  Download,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSession {
  session_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: 'active' | 'closed' | 'archived';
  last_activity: string;
  date_created: string;
  message_count: number;
  unread_count: number;
  agent_connected?: boolean;
}

interface ChatMessage {
  id_message: number;
  session_id: string;
  sender_type: 'client' | 'agent' | 'system';
  sender_name: string;
  message_content: string;
  message_type: 'text' | 'file' | 'system' | 'image';
  is_read: boolean;
  date_sent: string;
  image_url?: string;
  image_name?: string;
  image_size?: number;
}

const AdminMessanger = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const [agentEmail] = useState('support@lucci.com');
  const [agentName] = useState('Agent Support');
  const [isTypingClient, setIsTypingClient] = useState(false);
  const [showSessionsList, setShowSessionsList] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [agentConnectedSessions, setAgentConnectedSessions] = useState<Set<string>>(new Set());
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const API_BASE = 'api';

  // Set agent online status
  const setAgentStatus = async (online: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/agent_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: online ? 'online' : 'offline',
          agent_name: agentName,
          agent_email: agentEmail,
          status_message: online ? 'Disponible maintenant' : 'Absent temporairement'
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setIsOnline(online);
        
        if (online) {
          const heartbeatInterval = setInterval(async () => {
            if (isOnline) {
              await fetch(`${API_BASE}/agent_status.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'heartbeat',
                  agent_email: agentEmail
                }),
              });
            } else {
              clearInterval(heartbeatInterval);
            }
          }, 30000);
        }
      }
    } catch (error) {
      console.error('Error setting agent status:', error);
    }
  };

  // Connect agent to session
  const connectAgentToSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/chat_messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          sender_type: 'system',
          sender_name: 'System',
          message_content: 'Un agent s\'est connecté à la conversation',
          message_type: 'system'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAgentConnectedSessions(prev => new Set([...prev, sessionId]));
        
        // Update session to mark agent as connected
        await fetch(`${API_BASE}/chat_sessions.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            agent_connected: 1
          }),
        });
        
        toast({
          title: "Agent connecté",
          description: "Vous êtes maintenant connecté en temps réel avec le client."
        });

        // Refresh messages to show connection indicator
        fetchMessages(sessionId);
      }
    } catch (error) {
      console.error('Error connecting agent:', error);
    }
  };

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat_sessions.php`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
        console.log('Sessions fetched:', data.sessions);
      } else {
        console.error('Failed to fetch sessions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages
  const fetchMessages = async (sessionId: string, lastMsgId?: number) => {
    try {
      const url = new URL(`${API_BASE}/chat_messages.php`, window.location.origin);
      url.searchParams.append('session_id', sessionId);
      if (lastMsgId) {
        url.searchParams.append('last_message_id', lastMsgId.toString());
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.success) {
        if (lastMsgId) {
          setMessages(prev => [...prev, ...data.messages]);
        } else {
          setMessages(data.messages);
        }
        
        if (data.messages.length > 0) {
          const newLastId = Math.max(...data.messages.map((m: ChatMessage) => m.id_message));
          setLastMessageId(newLastId);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeSession || sendingMessage) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${API_BASE}/chat_messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession.session_id,
          sender_type: 'agent',
          sender_name: agentName,
          message_content: newMessage,
          message_type: 'text'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewMessage('');
        setMessages(prev => [...prev, data.message]);
        setLastMessageId(data.message.id_message);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Select session
  const selectSession = (session: ChatSession) => {
    setActiveSession(session);
    setMessages([]);
    setLastMessageId(null);
    fetchMessages(session.session_id);
    
    if (isMobile) {
      setShowSessionsList(false);
    }
    
    // Mark messages as read
    fetch(`${API_BASE}/chat_messages.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: session.session_id,
        sender_type: 'client'
      }),
    });

    // Connect agent if not already connected
    if (!agentConnectedSessions.has(session.session_id)) {
      connectAgentToSession(session.session_id);
    }
  };

  // Mobile back to sessions
  const backToSessions = () => {
    if (isMobile) {
      setActiveSession(null);
      setShowSessionsList(true);
    }
  };

  // Handle mobile keyboard
  const handleMobileInput = () => {
    if (isMobile && messageInputRef.current) {
      setTimeout(() => {
        messageInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredSessions = sessions.filter(session =>
    session.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Effects
  useEffect(() => {
    fetchSessions();
    setAgentStatus(true);
    
    if (isMobile && !activeSession) {
      setShowSessionsList(true);
    }
    
    // Auto-refresh sessions every 5 seconds for better real-time experience
    const sessionInterval = setInterval(fetchSessions, 5000);
    
    return () => {
      setAgentStatus(false);
      clearInterval(sessionInterval);
    };
  }, []);
  
  useEffect(() => {
    const handleFocus = () => {
      fetchSessions();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      fetchMessages(activeSession.session_id, lastMessageId || undefined);
    }, 2000); // Faster polling for real-time feel

    return () => clearInterval(interval);
  }, [activeSession, lastMessageId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message: ChatMessage) => (
    <div
      key={message.id_message}
      className={cn(
        "flex gap-3",
        isMobile ? "max-w-[85%]" : "max-w-[80%]",
        message.sender_type === 'agent' ? "ml-auto flex-row-reverse" : "",
        message.sender_type === 'system' ? "justify-center" : ""
      )}
    >
      {message.sender_type !== 'system' && (
        <Avatar className={cn(isMobile ? "w-8 h-8" : "w-8 h-8", "flex-shrink-0")}>
          <AvatarFallback className={cn(
            "text-xs",
            message.sender_type === 'agent'
              ? "bg-gradient-to-r from-gray-900 to-black text-white"
              : "bg-gray-200 text-gray-700"
          )}>
            {message.sender_type === 'agent' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "space-y-1",
        message.sender_type === 'agent' ? "items-end" : "items-start",
        message.sender_type === 'system' ? "items-center" : ""
      )}>
        <div className={cn(
          "rounded-2xl shadow-sm",
          isMobile ? "max-w-md" : "max-w-md",
          message.sender_type === 'agent'
            ? "bg-gradient-to-r from-gray-900 to-black text-white rounded-tr-md"
            : message.sender_type === 'system'
            ? "bg-green-100 border border-green-200 text-green-800 text-center px-4 py-2 rounded-full text-sm"
            : "bg-white border rounded-tl-md"
        )}>
          {message.sender_type === 'system' ? (
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              {message.message_content}
            </div>
          ) : (
            <div className={cn("px-4 py-2", isMobile ? "py-3" : "py-2")}>
              {message.message_content}
            </div>
          )}
        </div>
        
        {message.sender_type !== 'system' && (
          <div className={cn(
            "flex items-center gap-1 text-xs text-gray-500 px-1",
            message.sender_type === 'agent' ? "justify-end" : "justify-start"
          )}>
            <span>{formatTime(message.date_sent)}</span>
            {message.sender_type === 'agent' && (
              <div className="flex">
                {message.is_read ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Sessions List Component
  const SessionsList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("font-bold", isMobile ? "text-lg" : "text-xl")}>Messanger</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <Switch
                checked={isOnline}
                onCheckedChange={setAgentStatus}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            {!isMobile && <Settings className="w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer" />}
          </div>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
          )} />
          <span className="text-sm font-medium">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className={cn("p-2", isMobile ? "pb-20" : "")}>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune conversation
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.session_id}
                className={cn(
                  "flex items-center gap-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 mb-2",
                  isMobile ? "p-4 active:bg-gray-100" : "p-3",
                  activeSession?.session_id === session.session_id
                    ? "bg-gradient-to-r from-gray-900 to-black text-white"
                    : "bg-white hover:shadow-md"
                )}
                onClick={() => selectSession(session)}
              >
                <div className="relative">
                  <Avatar className={cn(isMobile ? "w-14 h-14" : "w-12 h-12")}>
                    <AvatarFallback className={cn(
                      "font-medium",
                      activeSession?.session_id === session.session_id
                        ? "bg-white/20 text-white"
                        : "bg-gradient-to-r from-gray-900 to-black text-white"
                    )}>
                      {getInitials(session.client_name || 'C')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 rounded-full border-2",
                    isMobile ? "w-5 h-5" : "w-4 h-4",
                    session.status === 'active' ? "bg-green-400" : "bg-gray-400",
                    activeSession?.session_id === session.session_id ? "border-gray-900" : "border-white"
                  )} />
                  {agentConnectedSessions.has(session.session_id) && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border border-white animate-pulse" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-medium truncate", isMobile ? "text-base" : "text-sm")}>
                      {session.client_name || 'Client Anonyme'}
                    </h3>
                    <span className={cn(
                      "text-xs flex-shrink-0 ml-2",
                      activeSession?.session_id === session.session_id
                        ? "text-white/70"
                        : "text-gray-500"
                    )}>
                      {formatDate(session.last_activity)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "text-sm truncate",
                      activeSession?.session_id === session.session_id
                        ? "text-white/70"
                        : "text-gray-600"
                    )}>
                      {session.client_email || 'Aucun email'}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {agentConnectedSessions.has(session.session_id) && (
                        <Badge className="bg-blue-500 text-white">Connecté</Badge>
                      )}
                      {session.unread_count > 0 && (
                        <Badge className={cn(
                          "bg-red-500 text-white text-xs flex-shrink-0",
                          isMobile ? "h-6 px-3" : "h-5 px-2"
                        )}>
                          {session.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <AdminLayout>
      <div className={cn(
        "flex bg-gradient-to-br from-gray-50 to-white",
        isMobile ? "h-[calc(100vh-4rem)] flex-col" : "h-[calc(100vh-6rem)]"
      )}>
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {(!activeSession || showSessionsList) && (
              <Card className="flex-1 flex flex-col bg-white rounded-none shadow-xl">
                <SessionsList />
              </Card>
            )}

            {activeSession && !showSessionsList && (
              <Card className="flex-1 flex flex-col bg-white rounded-none shadow-xl">
                {/* Mobile Chat Header */}
                <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={backToSessions}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-white/20 text-white">
                      {getInitials(activeSession.client_name || 'C')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{activeSession.client_name || 'Client Anonyme'}</h3>
                      {agentConnectedSessions.has(activeSession.session_id) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="text-sm text-white/70 truncate">
                      {activeSession.client_email || 'Aucun email'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {agentConnectedSessions.has(activeSession.session_id) && (
                      <Badge className="bg-green-500 text-white">Temps réel</Badge>
                    )}
                    <Badge
                      variant={activeSession.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        "capitalize text-xs",
                        activeSession.status === 'active' ? "bg-green-500" : "bg-gray-500"
                      )}
                    >
                      {activeSession.status === 'active' ? 'Actif' : 'Fermé'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Mobile Messages */}
                <ScrollArea className="flex-1 bg-gradient-to-b from-gray-50/50 to-white">
                  <div className="p-4 space-y-4 pb-6">
                    {messages.map(renderMessage)}

                    {/* Mobile Typing indicator */}
                    {isTypingClient && (
                      <div className="flex gap-3 max-w-[85%]">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
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
                </ScrollArea>

                {/* Mobile Message Input */}
                {activeSession.status === 'active' && (
                  <>
                    <Separator />
                    <div className="p-4 bg-white">
                      <div className="flex items-end gap-2 p-3 bg-gray-50 rounded-2xl">
                        <div className="flex-1 min-w-0">
                          <textarea
                            ref={messageInputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onFocus={handleMobileInput}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            placeholder="Tapez votre message..."
                            disabled={sendingMessage}
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                            rows={1}
                            style={{ minHeight: '24px', maxHeight: '96px' }}
                          />
                        </div>
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="rounded-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 p-3 flex-shrink-0"
                          size="sm"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            )}
          </>
        ) : (
          /* Desktop Layout */
          <>
            <Card className="w-80 flex flex-col bg-white border-r-0 rounded-r-none shadow-xl">
              <SessionsList />
            </Card>

            <Card className="flex-1 flex flex-col bg-white rounded-l-none shadow-xl">
              {activeSession ? (
                <>
                  {/* Desktop Chat Header */}
                  <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-white/20 text-white">
                          {getInitials(activeSession.client_name || 'C')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{activeSession.client_name || 'Client Anonyme'}</h3>
                          {agentConnectedSessions.has(activeSession.session_id) && (
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          {activeSession.client_email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {activeSession.client_email}
                            </span>
                          )}
                          {activeSession.client_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {activeSession.client_phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {agentConnectedSessions.has(activeSession.session_id) && (
                        <Badge className="bg-green-500 text-white">Temps réel</Badge>
                      )}
                      <Badge 
                        variant={activeSession.status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          "capitalize",
                          activeSession.status === 'active' ? "bg-green-500" : "bg-gray-500"
                        )}
                      >
                        {activeSession.status === 'active' ? 'Actif' : 'Fermé'}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Desktop Messages */}
                  <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50/50 to-white">
                    <div className="space-y-4">
                      {messages.map(renderMessage)}

                      {/* Desktop Typing indicator */}
                      {isTypingClient && (
                        <div className="flex gap-3 max-w-[80%]">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border rounded-2xl rounded-tl-md px-4 py-2 shadow-sm">
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
                  </ScrollArea>

                  {/* Desktop Message Input */}
                  {activeSession.status === 'active' && (
                    <>
                      <Separator />
                      <div className="p-4 bg-white">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-full">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            placeholder="Tapez votre message..."
                            disabled={sendingMessage}
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                            rows={1}
                            style={{ minHeight: '24px', maxHeight: '96px' }}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className="rounded-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900"
                            size="sm"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Desktop No Chat Selected */
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Messanger Professionnel</h3>
                    <p className="text-gray-600 max-w-md">
                      Sélectionnez une conversation pour commencer à chatter avec vos clients en temps réel.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessanger;
