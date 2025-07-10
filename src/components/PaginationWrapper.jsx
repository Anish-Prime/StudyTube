// components/PaginationWrapper.jsx
import React, { useState } from 'react';

const PaginationWrapper = ({ videos, render }) => {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(videos.length / perPage);
  const start = (page - 1) * perPage;
  const currentVideos = videos.slice(start, start + perPage);

  return (
    <div className="w-full">
      {render(currentVideos)}

      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          ⬅ Prev
        </button>

        <span className="text-gray-700 font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default PaginationWrapper;
