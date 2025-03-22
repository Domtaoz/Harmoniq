
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchInput: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative w-full"
    >
      <input
        type="text"
        placeholder="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-10 px-4 pr-10 rounded-full bg-white/80 backdrop-blur-sm shadow-inner border-none focus:ring-2 focus:ring-white/30 focus:outline-none transition-all"
      />
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-brand-pink transition-colors"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SearchInput;
