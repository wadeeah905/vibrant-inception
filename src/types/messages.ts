export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen: string;
  role: string;
  department?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  sessionId: string;
  read: boolean;
}

export interface Session {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}