import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Extract YouTube video ID from various URL formats
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Parse ISO 8601 duration (PT1H2M10S) to minutes
function parseISO8601Duration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return 0;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  // Return total minutes (with decimal for seconds)
  return hours * 60 + minutes + seconds / 60;
}

// YouTube metadata endpoint
app.get('/api/youtube/metadata', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    // Extract video ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL or video ID' });
    }
    
    // Get YouTube API key from environment
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ 
        error: 'YouTube API key not configured',
        hint: 'Please add YOUTUBE_API_KEY to Replit Secrets'
      });
    }
    
    // Call YouTube Data API v3
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Handle API errors
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'YouTube API error',
        details: data.error?.message || 'Unknown error'
      });
    }
    
    // Check if video exists
    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const video = data.items[0];
    const durationMinutes = parseISO8601Duration(video.contentDetails.duration);
    const durationSeconds = Math.round(durationMinutes * 60);
    
    // STRICT ENFORCEMENT: Block videos >8 minutes (480 seconds)
    if (durationSeconds > 480) {
      return res.status(400).json({ 
        error: 'Video exceeds 8-minute limit',
        duration: Math.round(durationMinutes * 100) / 100,
        durationSeconds,
        maxSeconds: 480
      });
    }
    
    // Return metadata
    res.json({
      videoId,
      title: video.snippet.title,
      channelName: video.snippet.channelTitle,
      duration: Math.round(durationMinutes * 100) / 100, // Minutes (rounded for display)
      durationSeconds, // Exact seconds for strict validation
      durationRaw: video.contentDetails.duration,
      thumbnail: video.snippet.thumbnails.default.url,
      verified: true
    });
    
  } catch (error) {
    console.error('YouTube metadata error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video metadata',
      details: error.message 
    });
  }
});

// YouTube search endpoint - find videos about habit formation
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // Get YouTube API key from environment
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ 
        error: 'YouTube API key not configured',
        hint: 'Please add YOUTUBE_API_KEY to Replit Secrets'
      });
    }
    
    // Call YouTube Data API v3 search endpoint
    // Using videoDuration=medium (4-20 min) then filtering to <=8min
    // Note: We filter more strictly client-side after fetching full metadata
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=medium&maxResults=${maxResults * 2}&key=${apiKey}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    // Handle API errors
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'YouTube API error',
        details: data.error?.message || 'Unknown error'
      });
    }
    
    // Extract video IDs from search results
    const videoIds = data.items?.map(item => item.id.videoId).filter(Boolean) || [];
    
    if (videoIds.length === 0) {
      return res.json({ videos: [] });
    }
    
    // Fetch detailed metadata for all videos (including duration)
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`;
    
    const detailsResponse = await fetch(videoDetailsUrl);
    const detailsData = await detailsResponse.json();
    
    if (!detailsResponse.ok) {
      return res.status(detailsResponse.status).json({ 
        error: 'YouTube API error fetching video details',
        details: detailsData.error?.message || 'Unknown error'
      });
    }
    
    // Filter and format videos that are 8 minutes or less
    const videos = detailsData.items
      ?.map(video => {
        const durationMinutes = parseISO8601Duration(video.contentDetails.duration);
        const durationSeconds = Math.round(durationMinutes * 60);
        
        // Only include videos ≤ 480 seconds (8 minutes)
        if (durationSeconds > 480) {
          return null;
        }
        
        return {
          videoId: video.id,
          title: video.snippet.title,
          channelName: video.snippet.channelTitle,
          duration: Math.round(durationMinutes * 100) / 100,
          durationSeconds,
          thumbnail: video.snippet.thumbnails.medium.url,
          description: video.snippet.description,
          youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`
        };
      })
      .filter(Boolean) || [];
    
    res.json({ 
      query,
      totalResults: videos.length,
      videos 
    });
    
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ 
      error: 'Failed to search YouTube',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'youtube-metadata-api' });
});

app.listen(PORT, () => {
  console.log(`🎬 YouTube metadata API running on http://localhost:${PORT}`);
  console.log(`   API key configured: ${process.env.YOUTUBE_API_KEY ? '✓ Yes' : '✗ No (add YOUTUBE_API_KEY to Secrets)'}`);
});
