import React, { useState, useEffect } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}
const suggestedSearches = [
    'Research on the use of Quantum Computing to train LLMs',
    'Real world implications of data privacy when using LLMs for customer-facing tasks.',
    'Using LLM-powered AI agents for mobile automation.',
    'LLM vs RPA for accuracy. When to use what?',
  ];
  

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0); // Add this line

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSearch = (query: string) => {
    onSearch(query);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(suggestedSearches[selectedSuggestionIndex]);
    } else if (e.key === 'ArrowDown') {
      setSelectedSuggestionIndex((prevIndex) => Math.min(prevIndex + 1, suggestedSearches.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
    onClick={onClose}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
      onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <ul className="mt-4 text-black">
          {suggestedSearches.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => onSearch(suggestion)}
              className="mt-2 p-2 hover:bg-dark-600 cursor-pointer rounded-md"
            >
              {suggestion}
            </li>
          ))}
        </ul>
    </div>
  </div>
  );
};

export default SearchModal;
