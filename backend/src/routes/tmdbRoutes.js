import express from 'express';
import axios from 'axios';

const router = express.Router();

router.all('/*', async (req, res) => {
  try {
    const tmdbPath = req.params[0];
    const tmdbUrl = `https://api.themoviedb.org/3/${tmdbPath}`;

    const response = await axios({
      method: req.method,
      url: tmdbUrl,
      params: req.query,
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('TMDB API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.status_message || 'Failed to fetch data from TMDB',
      error: error.message
    });
  }
});

export default router;
