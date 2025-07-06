import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-xl font-bold text-blue-700">📚 StudyTube</h1>
      <div className="space-x-4">
        <Link
          to="/"
          className={`font-semibold ${
            location.pathname === '/' ? 'text-blue-600 underline' : 'text-gray-600'
          }`}
        >
          🏠 Home
        </Link>
        <Link
          to="/library"
          className={`font-semibold ${
            location.pathname === '/library' ? 'text-blue-600 underline' : 'text-gray-600'
          }`}
        >
          📂 Library
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
