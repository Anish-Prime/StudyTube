import React from 'react';

const LibraryView = ({ library, onDelete, onView, onRename }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">📚 Your Library</h2>

      {library.length === 0 ? (
        <p className="text-center text-gray-500">No playlists created yet.</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {library.map((playlist) => (
            <div
              key={playlist.id}
              className="relative bg-white shadow-md rounded-md p-4 w-full max-w-md"
            >
              {/* ✏️ Rename button at top-right */}
              {playlist.type === 'custom' && (
                <button
                  onClick={() => onRename(playlist.id)}
                  className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 text-sm"
                >
                  ✏️ Rename
                </button>
              )}

              <h3 className="text-lg font-semibold text-gray-800">{playlist.name}</h3>
              <p className="text-sm text-gray-500 capitalize">Type: {playlist.type}</p>

              <div className="mt-4 flex justify-between flex-wrap gap-2">
                <button
                  onClick={() => onView(playlist)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  ▶ View
                </button>

                <button
                  onClick={() => onDelete(playlist.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
