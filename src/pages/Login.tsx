import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses, getButtonClasses } from '../config/theme';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Identifiants invalides');
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses(theme, 'background')} flex items-center justify-center p-4 transition-colors duration-200`}>
      <div className="w-full max-w-md">
        <div className={`${getThemeClasses(theme, 'backgroundSecondary')} rounded-lg shadow-xl p-8`}>
          <div className="flex flex-col items-center mb-8">
            <Shield className="w-12 h-12 text-primary-400 mb-4" />
            <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>GUARDON</h1>
            <p className={getThemeClasses(theme, 'textSecondary')}>Connectez-vous à votre compte</p>
            <p className={`text-sm ${getThemeClasses(theme, 'textTertiary')} mt-1`}>
              Utilisez test@example.com / password123
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textTertiary')} mb-2`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textTertiary')} mb-2`}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full text-white rounded-lg px-4 py-2 transition-colors ${getButtonClasses(theme, 'primary')}`}
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}