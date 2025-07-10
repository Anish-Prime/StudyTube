import React, { useState } from 'react';
import VideoCard from './VideoCard';

const PlaylistView = ({ playlist, onWatch, onRemove }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;

  const totalPages = Math.ceil(playlist.length / videosPerPage);

  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = playlist.slice(startIndex, startIndex + videosPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">📃 Your Study Playlist</h2>

      {playlist.length === 0 ? (
        <p className="text-gray-500 text-center">No videos in playlist yet.</p>
      ) : (
        <>
          <div className="flex flex-col items-center">
            {currentVideos.map((video) => (
              <VideoCard
                key={video.videoId}
                video={video}
                onWatch={onWatch}
                onRemove={onRemove}
              />
            ))}
          </div>

          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              ⬅ Prev
            </button>

            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistView;
