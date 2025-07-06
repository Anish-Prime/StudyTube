import React from 'react';

const GlobalPlayer = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center">
      <div className="relative w-[90%] max-w-4xl bg-gray-500 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-white text-center">
          🎥 {video.title}
        </h3>
        <div className="w-full">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full rounded-lg"
            style={{
              minHeight: '220px',
              height: '60vh',
              maxHeight: '70vh',
            }}
          ></iframe>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default GlobalPlayer;
