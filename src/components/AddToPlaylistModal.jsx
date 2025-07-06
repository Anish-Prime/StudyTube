import React, { useState } from 'react';

const AddToPlaylistModal = ({ customPlaylists, video, onAdd, onClose }) => {
  const [selectedId, setSelectedId] = useState('');

  const handleAdd = () => {
    if (!selectedId) return;
    onAdd(selectedId, video);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold m-4">📂 Add to Playlist</h2>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        >
          <option value="">Select a playlist</option>
          {customPlaylists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="flex justify-evenly gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 mx-6 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 mx-6 bg-purple-600 text-white rounded hover:bg-purple-900"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

};

export default AddToPlaylistModal;
