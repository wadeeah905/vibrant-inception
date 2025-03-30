import { User, Message, Session } from '../types/messages';

const STORAGE_KEYS = {
  USERS: 'chat_users',
  MESSAGES: 'chat_messages',
  SESSIONS: 'chat_sessions',
};

// Initialize with some sample data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
    lastSeen: 'En ligne',
    role: 'Agent de sécurité',
    department: 'Site A - Zone Nord',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
    lastSeen: 'En ligne',
    role: 'Superviseur',
    department: 'Site B - Zone Sud',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'offline',
    lastSeen: 'Vu il y a 2h',
    role: 'Agent de sécurité',
    department: 'Site A - Zone Est',
  },
];

const initialSessions: Session[] = [
  {
    id: '1',
    participants: ['1', '2'],
    createdAt: '2024-02-28T09:00:00Z',
    updatedAt: '2024-02-28T09:30:00Z',
  },
  {
    id: '2',
    participants: ['1', '3'],
    createdAt: '2024-02-28T08:00:00Z',
    updatedAt: '2024-02-28T08:45:00Z',
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Je commence ma ronde sur le Site A. Tout semble normal pour le moment.',
    timestamp: '2024-02-28T09:30:00Z',
    senderId: '1',
    sessionId: '1',
    read: true,
  },
  {
    id: '2',
    content: 'Parfait, tenez-moi informé de votre progression.',
    timestamp: '2024-02-28T09:31:00Z',
    senderId: '2',
    sessionId: '1',
    read: true,
  },
  {
    id: '3',
    content: 'Point de contrôle 3 terminé. Aucun incident à signaler.',
    timestamp: '2024-02-28T09:35:00Z',
    senderId: '1',
    sessionId: '1',
    read: false,
  },
];

// Initialize storage with sample data if empty
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initialSessions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
  }
}

// Users
export function getUsers(): User[] {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

// Sessions
export function getSessions(): Session[] {
  const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return sessions ? JSON.parse(sessions) : [];
}

export function getSessionById(id: string): Session | undefined {
  const sessions = getSessions();
  return sessions.find(session => session.id === id);
}

export function getUserSessions(userId: string): Session[] {
  const sessions = getSessions();
  return sessions.filter(session => session.participants.includes(userId));
}

// Messages
export function getMessages(): Message[] {
  const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return messages ? JSON.parse(messages) : [];
}

export function getSessionMessages(sessionId: string): Message[] {
  const messages = getMessages();
  return messages
    .filter(message => message.sessionId === sessionId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function addMessage(message: Omit<Message, 'id'>): Message {
  const messages = getMessages();
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
  };
  
  messages.push(newMessage);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

  // Update session
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === message.sessionId);
  if (sessionIndex !== -1) {
    sessions[sessionIndex].updatedAt = new Date().toISOString();
    sessions[sessionIndex].lastMessage = newMessage;
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  return newMessage;
}

export function createSession(participants: string[]): Session {
  const sessions = getSessions();
  const newSession: Session = {
    id: Date.now().toString(),
    participants,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  sessions.push(newSession);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  
  return newSession;
}

export function markMessagesAsRead(sessionId: string, userId: string): void {
  const messages = getMessages();
  const updated = messages.map(message => {
    if (message.sessionId === sessionId && message.senderId !== userId) {
      return { ...message, read: true };
    }
    return message;
  });
  
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
}