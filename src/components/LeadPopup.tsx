import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const LeadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenPopup');
      const timeSpent = sessionStorage.getItem('timeSpent');
      if (!hasSeenPopup && timeSpent && parseInt(timeSpent) >= 300) { // 300 seconds = 5 minutes
        setIsVisible(true);
      }
    }, 5000);

    // Track time spent on site
    const interval = setInterval(() => {
      const currentTime = parseInt(sessionStorage.getItem('timeSpent') || '0');
      sessionStorage.setItem('timeSpent', (currentTime + 1).toString());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('hasSeenPopup', 'true');
    setTimeout(() => setIsVisible(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVisible(false)} />
      <div className="relative bg-gray-900 border border-blue-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-blue-500/10">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Let's Connect!
              </h3>
              <p className="mt-2 text-gray-300">
                Get exclusive insights about my development process and early access to new projects.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
              <Send className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
            <p className="text-gray-300">You'll receive updates from me soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadPopup;