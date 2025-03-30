import { useState, useEffect, useCallback } from 'react';
import { Message, Session, User } from '../types/messages';
import * as storage from '../utils/localStorage';

export function useMessages(currentUserId: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize data
  useEffect(() => {
    storage.initializeStorage();
    setUsers(storage.getUsers());
    setSessions(storage.getUserSessions(currentUserId));
  }, [currentUserId]);

  // Load messages when active session changes
  useEffect(() => {
    if (activeSession) {
      const sessionMessages = storage.getSessionMessages(activeSession.id);
      setMessages(sessionMessages);
      storage.markMessagesAsRead(activeSession.id, currentUserId);
    }
  }, [activeSession, currentUserId]);

  const sendMessage = useCallback((content: string) => {
    if (!activeSession) return;

    const message = storage.addMessage({
      content,
      timestamp: new Date().toISOString(),
      senderId: currentUserId,
      sessionId: activeSession.id,
      read: false,
    });

    setMessages(prev => [...prev, message]);
  }, [activeSession, currentUserId]);

  const startNewSession = useCallback((participantId: string) => {
    // Check if session already exists
    const existingSession = sessions.find(session => 
      session.participants.includes(participantId) && 
      session.participants.includes(currentUserId)
    );

    if (existingSession) {
      setActiveSession(existingSession);
      return existingSession;
    }

    // Create new session
    const newSession = storage.createSession([currentUserId, participantId]);
    setSessions(prev => [...prev, newSession]);
    setActiveSession(newSession);
    return newSession;
  }, [sessions, currentUserId]);

  return {
    sessions,
    users,
    activeSession,
    messages,
    setActiveSession,
    sendMessage,
    startNewSession,
  };
}