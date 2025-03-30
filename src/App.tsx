
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rounds from './pages/Rounds/index';
import RoundsMap from './pages/Rounds/Map';
import RoundsHistory from './pages/Rounds/History';
import Users from './pages/Users';
import Messages from './pages/Messages';
import Administration from './pages/Administration';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Mobile from './pages/Mobile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="rounds" element={<Rounds />}>
            <Route index element={<RoundsMap />} />
            <Route path="history" element={<RoundsHistory />} />
          </Route>
          <Route path="users" element={<Users />} />
          <Route path="messages" element={<Messages />} />
          <Route path="administration" element={<Administration />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="mobile" element={<Mobile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
