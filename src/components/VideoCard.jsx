import React from 'react';

const VideoCard = ({
  video,
  addToPlaylist,
  onWatch,
  onRemove,
  onAddToLibrary,
  onAddPlaylistToLibrary,
}) => {
  const isPlaylist = video.type === 'playlist';

  return (
    <div className="bg-white shadow-md rounded-md p-4 m-2 w-full max-w-md">
      <img src={video.thumbnail} alt={video.title} className="rounded-md" />
      <h2 className="text-lg font-semibold mt-2">{video.title}</h2>
      <p className="text-sm text-gray-500">{video.channel}</p>

      <div className="mt-2">
        {isPlaylist ? (
          <>
            <span className="text-xs font-semibold text-purple-700 mr-2">📂 Playlist</span>
            {onAddPlaylistToLibrary && (
              <button
                onClick={() => onAddPlaylistToLibrary(video)}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                ➕ Add Playlist to Library
              </button>
            )}
          </>
        ) : (
          <>
            <span className="text-xs font-semibold text-blue-600 mr-2">🎥 Video</span>

            {addToPlaylist && (
              <button
                onClick={() => addToPlaylist(video)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add to Playlist
              </button>
            )}

            {onWatch && (
              <button
                onClick={() => onWatch(video)}
                className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ▶ Watch Now
              </button>
            )}

            {onRemove && (
              <button
                onClick={() => onRemove(video.videoId)}
                className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                🗑 Remove
              </button>
            )}

            {onAddToLibrary && (
              <button
                onClick={() => onAddToLibrary(video)}
                className="mt-2 ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                📂 Add to Custom Playlist
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
