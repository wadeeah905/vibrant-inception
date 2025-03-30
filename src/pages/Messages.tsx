import React, { useState } from 'react';
import { MessageSquare, Send, Search, MoreVertical, ArrowLeft, User, Bell, Info, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getThemeClasses, getButtonClasses, getDropdownClasses } from '../config/theme';
import { useMessages } from '../hooks/useMessages';
import { Session, User as UserType } from '../types/messages';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Messages() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    sessions,
    users,
    activeSession,
    messages,
    setActiveSession,
    sendMessage,
    startNewSession,
  } = useMessages(user?.id || '1'); // Fallback to '1' for demo

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSessionName = (session: Session): string => {
    const participant = users.find(u => 
      session.participants.includes(u.id) && u.id !== user?.id
    );
    return participant?.name || 'Unknown User';
  };

  const getSessionAvatar = (session: Session): string => {
    const participant = users.find(u => 
      session.participants.includes(u.id) && u.id !== user?.id
    );
    return participant?.avatar || '';
  };

  const getParticipantInfo = (session: Session): UserType | undefined => {
    return users.find(u => 
      session.participants.includes(u.id) && u.id !== user?.id
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeSession) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleUserSelect = (selectedUser: UserType) => {
    startNewSession(selectedUser.id);
  };

  const formatMessageTime = (timestamp: string): string => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const formatLastSeen = (timestamp: string): string => {
    return format(new Date(timestamp), "d MMMM 'à' HH:mm", { locale: fr });
  };

  return (
    <div className={`h-[calc(100vh-7rem)] ${getThemeClasses(theme, 'card')} rounded-xl`}>
      <div className="flex h-full">
        {/* Users List */}
        <div className={`w-80 border-r ${getThemeClasses(theme, 'border')} flex flex-col`}>
          <div className="p-4 border-b border-inherit">
            <h2 className={`text-lg font-semibold ${getThemeClasses(theme, 'text')} mb-4`}>Messages</h2>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
              <input
                type="text"
                placeholder="Rechercher des utilisateurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${getThemeClasses(theme, 'input')}`}
              />
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto ${getThemeClasses(theme, 'scrollbar')}`}>
            {sessions.map((session) => {
              const participant = getParticipantInfo(session);
              if (!participant) return null;

              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={`w-full p-4 flex items-center space-x-3 ${getThemeClasses(theme, 'hover')} ${
                    activeSession?.id === session.id ? getThemeClasses(theme, 'backgroundTertiary') : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${getThemeClasses(theme, 'backgroundSecondary')} ${
                      participant.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-medium ${getThemeClasses(theme, 'text')}`}>{participant.name}</h3>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                      {session.lastMessage?.content || 'Aucun message'}
                    </p>
                  </div>
                  {session.lastMessage && !session.lastMessage.read && session.lastMessage.senderId !== user?.id && (
                    <span className="bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      1
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {activeSession ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className={`p-4 border-b ${getThemeClasses(theme, 'border')} flex items-center justify-between`}>
              <div className="flex items-center space-x-4">
                <button 
                  className={`md:hidden p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
                  onClick={() => setActiveSession(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={getSessionAvatar(activeSession)}
                      alt={getSessionName(activeSession)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${getThemeClasses(theme, 'backgroundSecondary')} ${
                      getParticipantInfo(activeSession)?.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                      {getSessionName(activeSession)}
                    </h3>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                      {getParticipantInfo(activeSession)?.status === 'online' 
                        ? 'En ligne' 
                        : `Vu ${formatLastSeen(getParticipantInfo(activeSession)?.lastSeen || '')}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
                >
                  <MoreVertical className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                </button>

                {showDropdown && (
                  <div className={`absolute right-0 mt-2 w-56 ${getDropdownClasses(theme, 'background')} rounded-lg shadow-lg ${getDropdownClasses(theme, 'border')} border py-1 z-10`}>
                    <button
                      onClick={() => {
                        setShowUserInfo(true);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-2 ${getThemeClasses(theme, 'hover')} ${getThemeClasses(theme, 'text')}`}
                    >
                      <Info className="w-4 h-4" />
                      <span>Voir les informations</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-2 px-4 py-2 ${getThemeClasses(theme, 'hover')} ${getThemeClasses(theme, 'text')}`}
                    >
                      <Bell className="w-4 h-4" />
                      <span>Envoyer une notification</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 p-4 overflow-y-auto ${getThemeClasses(theme, 'scrollbar')} space-y-4`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.senderId === user?.id ? 'bg-primary-500 text-white' : `${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'text')}`} rounded-lg p-3`}>
                    <p>{message.content}</p>
                    <span className={`text-xs mt-1 block ${message.senderId === user?.id ? 'text-primary-100' : getThemeClasses(theme, 'textSecondary')}`}>
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t ${getThemeClasses(theme, 'border')}`}>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className={`flex-1 ${getThemeClasses(theme, 'input')}`}
                />
                <button 
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${getButtonClasses(theme, 'primary')} flex items-center space-x-2`}
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className={`w-12 h-12 ${getThemeClasses(theme, 'textSecondary')} mx-auto mb-4`} />
              <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-2`}>
                Sélectionnez une conversation
              </h3>
              <p className={getThemeClasses(theme, 'textSecondary')}>
                Choisissez un utilisateur dans la liste pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Info Modal */}
      {showUserInfo && activeSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Informations de l'utilisateur
              </h2>
              <button
                onClick={() => setShowUserInfo(false)}
                className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
              >
                <X className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
              </button>
            </div>

            <div className="space-y-6">
              {(() => {
                const participant = getParticipantInfo(activeSession);
                if (!participant) return null;

                return (
                  <>
                    <div className="flex items-center space-x-4">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')}`}>
                          {participant.name}
                        </h3>
                        <p className={`${getThemeClasses(theme, 'textSecondary')}`}>
                          {participant.role}
                        </p>
                      </div>
                    </div>

                    <div className={`space-y-4 ${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
                      <div>
                        <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Email</p>
                        <p className={getThemeClasses(theme, 'text')}>{participant.email}</p>
                      </div>
                      {participant.department && (
                        <div>
                          <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Département</p>
                          <p className={getThemeClasses(theme, 'text')}>{participant.department}</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              <button
                onClick={() => setShowUserInfo(false)}
                className={`w-full ${getButtonClasses(theme, 'secondary')} py-2 rounded-lg`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}