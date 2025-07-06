import React from 'react';
import VideoCard from './VideoCard';

const PlaylistView = ({ playlist, onWatch, onRemove }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">📃 Your Study Playlist</h2>
      <div className="flex flex-col items-center">
        {playlist.length === 0 ? (
          <p className="text-gray-500">No videos in playlist yet.</p>
        ) : (
          playlist.map((video) => (
            <VideoCard
              key={video.videoId}
              video={video}
              onWatch={onWatch}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
