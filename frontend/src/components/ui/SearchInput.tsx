import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchInput: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // ✅ Debounced URL update on every keystroke
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/`);
      }
    }, 300); // debounce delay in ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <form 
      onSubmit={(e) => e.preventDefault()} // no need to submit anymore
      className="relative w-full"
    >
      <input
        type="text"
        placeholder="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-10 px-4 pr-10 rounded-full bg-white/80 backdrop-blur-sm shadow-inner border-none focus:ring-2 focus:ring-white/30 focus:outline-none transition-all"
      />
      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
        <Search className="h-5 w-5" />
      </span>
    </form>
  );
};

export default SearchInput;
