import React from 'react';

const VideoCard = ({
  video,
  addToPlaylist,
  onWatch,
  onRemove,
  onAddToLibrary,
  onAddPlaylistToLibrary,
  onMove,
  onToggleWatched,
  onToggleRevisit
}) => {
  const isPlaylist = video.type === 'playlist';

  const getCardStyles = () => {
    if (video.revisit) return 'bg-yellow-100 border border-yellow-300';
    if (video.watched) return 'bg-green-100 border border-green-300';
    return 'bg-white';
  };

  return (
    <div className={`flex flex-col sm:flex-row shadow-md rounded-md p-4 m-2 w-full max-w-4xl ${getCardStyles()}`}>
      <div className="sm:w-48 w-full mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-auto rounded-md object-cover"
        />
      </div>

      {/* Details and buttons on the right */}
      <div className="flex flex-col justify-between w-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{video.channel}</p>
          {isPlaylist && (
            <span className="text-xs font-semibold text-purple-700">📂 Playlist</span>
          )}
          {!isPlaylist && (
            <span className="text-xs font-semibold text-blue-600">🎥 Video</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {isPlaylist && onAddPlaylistToLibrary && (
            <button
              onClick={() => onAddPlaylistToLibrary(video)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              ➕ Add Playlist to Library
            </button>
          )}

          {!isPlaylist && (
            <>
              {addToPlaylist && (
                <button
                  onClick={() => addToPlaylist(video)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Add to Playlist
                </button>
              )}

              {onWatch && (
                <button
                  onClick={() => onWatch(video)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ▶ Watch Now
                </button>
              )}

              {onRemove && (
                <button
                  onClick={() => onRemove(video.videoId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🗑 Remove
                </button>
              )}

              {onMove && (
                <>
                  <button
                    onClick={() => onMove(video.videoId, 'up')}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ⬆
                  </button>
                  <button
                    onClick={() => onMove(video.videoId, 'down')}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ⬇
                  </button>
                </>
              )}

              {onToggleWatched && (
                <button
                  onClick={() => onToggleWatched(video.videoId)}
                  className={`px-3 py-2 rounded ${
                    video.watched
                      ? 'bg-green-700 text-white'
                      : 'bg-green-200 text-gray-800 hover:bg-green-300'
                  }`}
                >
                  {video.watched ? '✔ Watched' : 'Mark as Watched'}
                </button>
              )}

              {onToggleRevisit && (
                <button
                  onClick={() => onToggleRevisit(video.videoId)}
                  className={`px-3 py-2 rounded ${
                    video.revisit
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-200 text-gray-800 hover:bg-yellow-300'
                  }`}
                >
                  {video.revisit ? '🔁 Revisit' : 'Revisit Later'}
                </button>
              )}

              {onAddToLibrary && (
                <button
                  onClick={() => onAddToLibrary(video)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  📂 Add to Custom Playlist
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
