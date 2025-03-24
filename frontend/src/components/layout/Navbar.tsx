import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Search, Ticket, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SearchInput from '@/components/ui/SearchInput';

const Navbar: React.FC = () => {
  const { state } = useApp();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-pink-500/95 backdrop-blur-navbar shadow-lg' : 'bg-pink-500'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
            <Music className="h-8 w-8 text-white" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link text-white font-medium ${
                location.pathname === '/' ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/filter" 
              className={`nav-link text-white font-medium ${
                location.pathname === '/filter' ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Filter
            </Link>
          </nav>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <SearchInput />
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            to="/tickets" 
            className="flex items-center text-white transition-opacity hover:opacity-80"
          >
            <Ticket className="h-6 w-6" />
            <span className="hidden md:inline ml-1">Ticket</span>
          </Link>
          
          {state.auth.isAuthenticated ? (
            <Link to="/profile" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center">
                {state.auth.user?.profilePictureUrl ? (
                  <img 
                    src={state.auth.user.profilePictureUrl} 
                    alt={state.auth.user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-pink-500" />
                )}
              </div>
              <span className="text-white text-sm hidden md:inline">
                {state.auth.user?.displayName || state.auth.user?.username}
              </span>
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105"
            >
              <User className="h-5 w-5 text-pink-500" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;