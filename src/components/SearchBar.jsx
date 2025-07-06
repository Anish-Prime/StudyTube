import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-6">
      <input
        type="text"
        placeholder="Search for study videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-3/5 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
