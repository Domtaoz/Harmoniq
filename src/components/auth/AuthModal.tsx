
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      const user = {
        id: uuidv4(),
        username,
        avatar: `https://api.dicebear.com/6.x/micah/svg?seed=${username}`
      };

      dispatch({ type: 'LOGIN', payload: user });
      navigate('/');
    }, 1000);
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-brand-darkGray rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-amber-500">
                {mode === 'login' ? 'Login' : 'Register'}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-full border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600"
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-full border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600"
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {mode === 'register' && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-10 pr-10 rounded-full border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-600"
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-pink text-white rounded-full font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-95"
                >
                  {mode === 'login' ? 'Login' : 'Register'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {mode === 'login' ? "Don't have an account?" : "have an account?"}{' '}
                  <button
                    onClick={toggleMode}
                    className="text-brand-pink font-medium hover:underline transition-all"
                  >
                    {mode === 'login' ? 'Register' : 'Login'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthModal;
