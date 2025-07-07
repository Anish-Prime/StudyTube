import React from 'react';
import LibraryView from '../components/LibraryView';
import VideoCard from '../components/VideoCard';

const LibraryPage = ({
  library,
  setLibrary,
  activePlaylist,
  setActivePlaylist,
  onDelete,
  onView,
  onBack,
  onWatch
}) => {
  const handleToggleWatched = (videoId) => {
    const updatedLibrary = library.map((playlist) => {
      if (playlist.id === activePlaylist.id && playlist.type === 'custom') {
        const updatedVideos = playlist.videos.map((video) =>
          video.videoId === videoId
            ? { ...video, watched: !video.watched }
            : video
        );
        return { ...playlist, videos: updatedVideos };
      }
      return playlist;
    });

    setLibrary(updatedLibrary);
    setActivePlaylist((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.videoId === videoId ? { ...v, watched: !v.watched } : v
      ),
    }));
  };

  const handleToggleRevisit = (videoId) => {
    const updatedLibrary = library.map((playlist) => {
      if (playlist.id === activePlaylist.id && playlist.type === 'custom') {
        const updatedVideos = playlist.videos.map((video) =>
          video.videoId === videoId
            ? { ...video, revisit: !video.revisit }
            : video
        );
        return { ...playlist, videos: updatedVideos };
      }
      return playlist;
    });

    setLibrary(updatedLibrary);
    setActivePlaylist((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.videoId === videoId ? { ...v, revisit: !v.revisit } : v
      ),
    }));
  };

  const handleToggleWatchedYouTube = (videoId) => {
    const updatedLibrary = library.map((playlist) => {
      if (playlist.id === activePlaylist.id && playlist.type === 'youtube') {
        const updatedVideos = playlist.videos.map((video) =>
          video.videoId === videoId
            ? { ...video, watched: !video.watched }
            : video
        );
        return { ...playlist, videos: updatedVideos };
      }
      return playlist;
    });

    setLibrary(updatedLibrary);
    setActivePlaylist((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.videoId === videoId ? { ...v, watched: !v.watched } : v
      ),
    }));
  };

  const handleToggleRevisitYouTube = (videoId) => {
    const updatedLibrary = library.map((playlist) => {
      if (playlist.id === activePlaylist.id && playlist.type === 'youtube') {
        const updatedVideos = playlist.videos.map((video) =>
          video.videoId === videoId
            ? { ...video, revisit: !video.revisit }
            : video
        );
        return { ...playlist, videos: updatedVideos };
      }
      return playlist;
    });

    setLibrary(updatedLibrary);
    setActivePlaylist((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.videoId === videoId ? { ...v, revisit: !v.revisit } : v
      ),
    }));
  };

  const handleRemoveFromCustom = (videoId) => {
    const updatedLibrary = library.map((p) => {
      if (p.id === activePlaylist.id && p.type === 'custom') {
        return {
          ...p,
          videos: p.videos.filter((v) => v.videoId !== videoId),
        };
      }
      return p;
    });

    setLibrary(updatedLibrary);
    setActivePlaylist((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.videoId !== videoId),
    }));
  };

  const handleMoveVideo = (videoId, direction) => {
    const playlist = activePlaylist;
    if (!playlist || playlist.type !== 'custom') return;

    const index = playlist.videos.findIndex((v) => v.videoId === videoId);
    if (index < 0) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= playlist.videos.length) return;

    const newVideos = [...playlist.videos];
    const [moved] = newVideos.splice(index, 1);
    newVideos.splice(newIndex, 0, moved);

    const updatedLibrary = library.map((p) =>
      p.id === playlist.id
        ? { ...p, videos: newVideos }
        : p
    );

    setLibrary(updatedLibrary);
    setActivePlaylist({ ...playlist, videos: newVideos });
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">📂 Your Library</h1>

      {activePlaylist ? (
        <div className="mt-10 w-full flex flex-col items-center px-4">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">
            🎧 {activePlaylist.name}
          </h3>

          {activePlaylist.videos.length === 0 ? (
            <p className="text-gray-500">No videos in this playlist yet.</p>
          ) : (
            <div className="flex flex-col items-center">
              {activePlaylist.videos.map((video) => (
                <VideoCard
                  key={video.videoId}
                  video={video}
                  onWatch={onWatch}
                  onRemove={activePlaylist.type === 'custom' ? handleRemoveFromCustom : undefined}
                  onMove={activePlaylist.type === 'custom' ? handleMoveVideo : undefined}
                  onToggleWatched={
                    activePlaylist.type === 'custom'
                      ? handleToggleWatched
                      : activePlaylist.type === 'youtube'
                      ? handleToggleWatchedYouTube
                      : undefined
                  }
                  onToggleRevisit={
                    activePlaylist.type === 'custom'
                      ? handleToggleRevisit
                      : activePlaylist.type === 'youtube'
                      ? handleToggleRevisitYouTube
                      : undefined
                  }
                />
              ))}
            </div>
          )}

          <button
            onClick={onBack}
            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ⬅ Back to Library
          </button>
        </div>
      ) : (
        <LibraryView library={library} onDelete={onDelete} onView={onView} />
      )}
    </div>
  );
};

export default LibraryPage;
