import React, { createContext, useContext, useState } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  session: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<boolean>(false);

  const value = {
    user,
    session,
    signIn: async (email: string, password: string) => {
      if (email === 'test@example.com' && password === 'password123') {
        const user = {
          email: 'test@example.com',
          name: 'Iheb Chebbi'
        };
        setUser(user);
        setSession(true);
      } else {
        throw new Error('Invalid credentials');
      }
    },
    signOut: async () => {
      setUser(null);
      setSession(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}