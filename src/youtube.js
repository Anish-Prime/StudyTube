const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// youtube.js

export const fetchPlaylistVideos = async (playlistId) => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const maxResults = 50;
  const allVideos = [];
  let nextPageToken = '';

  try {
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}&pageToken=${nextPageToken}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.items) {
        const videos = data.items.map((item) => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          channel: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.medium?.url || '',
          watched: false,
          revisit: false,
        }));

        allVideos.push(...videos);
      }

      nextPageToken = data.nextPageToken || '';

    } while (nextPageToken);

    return allVideos;
  } catch (err) {
    console.error('Failed to fetch playlist videos:', err);
    return [];
  }
};

export async function fetchYouTubeVideos(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video,playlist&q=${encodeURIComponent(
    query
  )}&maxResults=10&key=${API_KEY}`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    const results = data.items.map((item) => {
      const isPlaylist = item.id.kind === 'youtube#playlist';
      const isVideo = item.id.kind === 'youtube#video';

      return {
        type: isPlaylist ? 'playlist' : 'video',
        videoId: isVideo ? item.id.videoId : null,
        playlistId: isPlaylist ? item.id.playlistId : null,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || '',
      };
    });

    return results;
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    throw error;
  }
}
