const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchPlaylistVideos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const videos = data.items.map((item) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      channel: item.snippet.videoOwnerChannelTitle || '',
      thumbnail: item.snippet.thumbnails?.medium?.url || '',
      type: 'video',
    }));

    return videos;
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return [];
  }
}

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
