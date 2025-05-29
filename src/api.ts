// api.ts (TypeScript, Express)
import express from 'express';
import axios from 'axios';

const app = express();

app.get('/ytdata', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || typeof videoUrl !== 'string') {
    return res.status(400).json({ error: 'Missing url query param' });
  }

  try {
    const response = await axios.get(videoUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36',
      },
    });

    const html = response.data;
    const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/);

    if (!match) {
      return res.status(500).json({ error: 'Player response not found' });
    }

    const playerResponse = JSON.parse(match[1]);

    const videoDetails = playerResponse.videoDetails;
    const streamingData = playerResponse.streamingData;

    res.json({
      title: videoDetails.title,
      videoId: videoDetails.videoId,
      author: videoDetails.author,
      duration: videoDetails.lengthSeconds,
      formats: streamingData.formats,
      adaptiveFormats: streamingData.adaptiveFormats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch YouTube data' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
