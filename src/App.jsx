import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import VideoCard from './components/VideoCard';
import PlaylistView from './components/PlaylistView';
import { fetchYouTubeVideos, fetchPlaylistVideos } from './youtube';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import LibraryPage from './pages/LibraryPage';
import Layout from './components/Layout';

function App() {
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleWatch = (video) => {
    setSelectedVideo(video);
    navigate('/');
  };

  useEffect(() => {
    try {
      const savedPlaylist = JSON.parse(localStorage.getItem('studyTubePlaylist'));
      const savedLibrary = JSON.parse(localStorage.getItem('studyTubeLibrary'));

      if (Array.isArray(savedPlaylist)) setPlaylist(savedPlaylist);
      if (Array.isArray(savedLibrary) && savedLibrary.length > 0 && library.length === 0) {
        setLibrary(savedLibrary);
      }
    } catch (e) {
      console.error("LocalStorage load failed:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTubePlaylist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('studyTubeLibrary', JSON.stringify(library));
  }, [library]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchYouTubeVideos(query);
      setVideos(results);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching videos.');
    } finally {
      setLoading(false);
    }
  };

  const addToPlaylist = (video) => {
    if (!playlist.find((v) => v.videoId === video.videoId)) {
      setPlaylist((prev) => [...prev, video]);
    }
  };

  const removeFromPlaylist = (videoId) => {
    setPlaylist((prev) => prev.filter((v) => v.videoId !== videoId));
  };

  const handleCreatePlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (!name) return;

    const newPlaylist = {
      id: Math.random().toString(36).slice(2),
      name,
      type: 'custom',
      videos: [],
    };

    setLibrary((prev) => [...prev, newPlaylist]);
  };

  const handleAddToLibraryClick = (video) => {
    setModalVideo(video);
    setShowModal(true);
  };

  const handleAddToCustomPlaylist = (playlistId, video) => {
    setLibrary((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && p.type === 'custom') {
          const exists = p.videos.some((v) => v.videoId === video.videoId);
          if (!exists) {
            return { ...p, videos: [...p.videos, video] };
          }
        }
        return p;
      })
    );
  };

  const handleAddPlaylistToLibrary = (playlist) => {
    const exists = library.some((p) => p.id === playlist.playlistId && p.type === 'youtube');
    if (exists) return;

    setLibrary((prev) => [
      ...prev,
      {
        id: playlist.playlistId,
        name: playlist.title,
        type: 'youtube',
        videos: null,
      },
    ]);
  };

  const handleViewPlaylist = async (playlist) => {
    if (playlist.type === 'youtube' && playlist.videos === null) {
      const fetched = await fetchPlaylistVideos(playlist.id);

      // Add default watched/revisit status
      const enhanced = fetched.map((video) => ({
        ...video,
        watched: false,
        revisit: false,
      }));

      const updated = library.map((p) =>
        p.id === playlist.id ? { ...p, videos: enhanced } : p
      );

      setLibrary(updated);
      setActivePlaylist({ ...playlist, videos: enhanced });
    } else {
      setActivePlaylist(playlist);
    }
  };

  return (
    <Routes>
      <Route element={<Layout selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />}>
        <Route
          path="/"
          element={
            <div>
              <button
                onClick={handleCreatePlaylist}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
              >
                ➕ Create New Playlist
              </button>

              <SearchBar onSearch={handleSearch} />

              {loading && <p className="text-center text-blue-500 mt-4">Searching for videos...</p>}
              {error && <p className="text-center text-red-500 mt-4">{error}</p>}

              <div className="flex flex-col items-center mt-12 mb-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.videoId || video.playlistId}
                    video={video}
                    onAddToLibrary={handleAddToLibraryClick}
                    onAddPlaylistToLibrary={handleAddPlaylistToLibrary}
                  />
                ))}
              </div>

              {selectedVideo && (
                <div className="mt-10 w-full flex flex-col items-center px-4">
                  <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
                    🎥 {selectedVideo.title}
                  </h3>

                  <div className="w-full max-w-4xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg shadow-lg w-full"
                      style={{
                        minHeight: '220px',
                        height: '60vh',
                        maxHeight: '70vh',
                      }}
                    ></iframe>
                  </div>

                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    ✖ Close
                  </button>
                </div>
              )}

              <PlaylistView
                playlist={playlist}
                onWatch={handleWatch}
                onRemove={removeFromPlaylist}
              />

              {showModal && (
                <div className="fixed inset-0 z-50">
                  <AddToPlaylistModal
                    customPlaylists={library.filter((p) => p.type === 'custom')}
                    video={modalVideo}
                    onAdd={handleAddToCustomPlaylist}
                    onClose={() => setShowModal(false)}
                  />
                </div>
              )}
            </div>
          }
        />

        <Route
          path="/library"
          element={
            <LibraryPage
              library={library}
              setLibrary={setLibrary}
              activePlaylist={activePlaylist}
              setActivePlaylist={setActivePlaylist}
              onDelete={(id) => {
                setLibrary((prev) => prev.filter((p) => p.id !== id));
              }}
              onView={handleViewPlaylist}
              onBack={() => setActivePlaylist(null)}
              onWatch={handleWatch}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
