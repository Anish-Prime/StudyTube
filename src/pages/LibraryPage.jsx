import React, { useEffect, useRef, useState } from 'react';
import LibraryView from '../components/LibraryView';
import VideoCard from '../components/VideoCard';

const LibraryPage = ({
  library,
  setLibrary,
  activePlaylist,
  setActivePlaylist,
  onDelete,
  onView,
  onRename,
  onBack,
  onWatch,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;
  const paginationRef = useRef(null);

  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const handleToggle = (videoId, key) => {
    const updatedLibrary = library.map((playlist) => {
      if (playlist.id === activePlaylist.id) {
        const updatedVideos = playlist.videos.map((video) =>
          video.videoId === videoId ? { ...video, [key]: !video[key] } : video
        );
        return { ...playlist, videos: updatedVideos };
      }
      return playlist;
    });

    setLibrary(updatedLibrary);
    setActivePlaylist((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.videoId === videoId ? { ...v, [key]: !v[key] } : v
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
    const index = activePlaylist.videos.findIndex((v) => v.videoId === videoId);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || newIndex < 0 || newIndex >= activePlaylist.videos.length) return;

    const newVideos = [...activePlaylist.videos];
    const [moved] = newVideos.splice(index, 1);
    newVideos.splice(newIndex, 0, moved);

    const updatedLibrary = library.map((p) =>
      p.id === activePlaylist.id ? { ...p, videos: newVideos } : p
    );

    setLibrary(updatedLibrary);
    setActivePlaylist({ ...activePlaylist, videos: newVideos });
  };

  const totalPages = Math.ceil((activePlaylist?.videos?.length || 0) / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = activePlaylist?.videos?.slice(startIndex, startIndex + videosPerPage) || [];

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">📂 Your Library</h1>

      {activePlaylist ? (
        <div className="mt-10 w-full flex flex-col items-center px-4">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">🎧 {activePlaylist.name}</h3>

          {activePlaylist.videos.length === 0 ? (
            <p className="text-gray-500">No videos in this playlist yet.</p>
          ) : (
            <div className="flex flex-col items-center">
              {currentVideos.map((video) => (
                <VideoCard
                  key={video.videoId}
                  video={video}
                  onWatch={onWatch}
                  onRemove={activePlaylist.type === 'custom' ? handleRemoveFromCustom : undefined}
                  onMove={activePlaylist.type === 'custom' ? handleMoveVideo : undefined}
                  onToggleWatched={(id) => handleToggle(id, 'watched')}
                  onToggleRevisit={(id) => handleToggle(id, 'revisit')}
                />
              ))}
            </div>
          )}

          <div ref={paginationRef} className="mt-6 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded border-1 ${
                currentPage === 1
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              ⬅ Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`px-3 py-1 rounded border-1 font-semibold transition-colors duration-200 ${
                    pageNum === currentPage
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded border-1 ${
                currentPage === totalPages
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next ➡
            </button>
          </div>

          <button
            onClick={onBack}
            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ⬅ Back to Library
          </button>
        </div>
      ) : (
        <LibraryView library={library} onDelete={onDelete} onView={onView} onRename={onRename}/>
      )}
    </div>
  );
};

export default LibraryPage;
