import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import VideoCard from './components/VideoCard';
import PlaylistView from './components/PlaylistView';
import { fetchYouTubeVideos, fetchPlaylistVideos } from './youtube';
import LibraryView from './components/LibraryView';
import AddToPlaylistModal from './components/AddToPlaylistModal';

function App() {
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [library, setLibrary] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);

  const handleWatch = (video) => {
    setSelectedVideo(video);
  };

  useEffect(() => {
    try {
      const savedLibrary = localStorage.getItem('studyTubeLibrary');
      if (savedLibrary) {
        const parsed = JSON.parse(savedLibrary);
        if (Array.isArray(parsed)) {
          setLibrary(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load library from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('studyTubeLibrary', JSON.stringify(library));
    } catch (e) {
      console.error("Failed to save library to localStorage:", e);
    }
  }, [library]);

  // ✅ Load playlist from localStorage safely on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('studyTubePlaylist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPlaylist(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load playlist from localStorage:", e);
    }
  }, []);

  // ✅ Save playlist to localStorage when it changes
  useEffect(() => {
    try {
      if (playlist.length > 0) {
        localStorage.setItem('studyTubePlaylist', JSON.stringify(playlist));
      }
    } catch (e) {
      console.error("Failed to save playlist to localStorage:", e);
    }
  }, [playlist]);

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

  const removeFromPlaylist = (videoId) => {
    setPlaylist((prev) => prev.filter((video) => video.videoId !== videoId));
  };

  const handleAddToLibraryClick = (video) => {
    setModalVideo(video);
    setShowModal(true);
  };

  const handleAddToCustomPlaylist = (playlistId, video) => {
    setLibrary((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId && playlist.type === 'custom') {
          const exists = playlist.videos.some((v) => v.videoId === video.videoId);
          if (exists) return playlist;

          return {
            ...playlist,
            videos: [...playlist.videos, video],
          };
        }
        return playlist;
      })
    );
  };

  const handleAddPlaylistToLibrary = (playlist) => {
    const exists = library.some((p) => p.id === playlist.playlistId && p.type === 'youtube');
    if (exists) return;

    const newPlaylist = {
      id: playlist.playlistId,
      name: playlist.title,
      type: 'youtube',
      videos: null, // we'll load it later
    };

    setLibrary((prev) => [...prev, newPlaylist]);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-4">

      <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">📚 StudyTube</h1>

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

      {
        selectedVideo && (
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
          </div> )
      }


      <PlaylistView playlist={playlist} onWatch={handleWatch} onRemove={removeFromPlaylist}/>

      <LibraryView
        library={library}
        onDelete={(id) => {
          setLibrary((prev) => prev.filter((p) => p.id !== id));
        }}
        onView={async (playlist) => {
          if (playlist.type === 'youtube' && playlist.videos === null) {
            const videoList = await fetchPlaylistVideos(playlist.id);
            const updated = library.map((p) =>
              p.id === playlist.id ? { ...p, videos: videoList } : p
            );
            setLibrary(updated);
            setActivePlaylist({ ...playlist, videos: videoList });
          } else {
            setActivePlaylist(playlist);
          }
        }}
      />

      {activePlaylist && (
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
                  onWatch={handleWatch}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setActivePlaylist(null)}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ⬅ Back to Library
          </button>
        </div>
      )}

      {showModal && (
        <AddToPlaylistModal
          customPlaylists={library.filter((p) => p.type === 'custom')}
          video={modalVideo}
          onAdd={handleAddToCustomPlaylist}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}

export default App;
