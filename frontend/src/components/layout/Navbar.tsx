import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, Search, Ticket, User, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SearchInput from '@/components/ui/SearchInput';

const Navbar: React.FC = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('loggedInUser');
      navigate('/');
    }
  };

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
            <>
              <Link to="/profile" className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center">
                  {state.auth.user?.avatar ? (
                    <img 
                      src={state.auth.user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-pink-500" />
                  )}
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
              >
                <LogOut className="h-5 w-5 text-pink-500" />
              </button>
            </>
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
