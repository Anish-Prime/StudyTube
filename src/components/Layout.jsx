import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import GlobalPlayer from './GlobalPlayer';

const Layout = ({ selectedVideo, setSelectedVideo }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>

      {/* 🔥 Global Video Player */}
      <GlobalPlayer
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};

export default Layout;
