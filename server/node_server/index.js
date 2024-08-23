const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');
const request = require('request');

// connection to mongodb
const {mongoose} = require('mongoose');

// allow connection to python scripts for lyrics
const { exec } = require('child_process');

const app = express();
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Include cookies in CORS requests
}));

// Handle preflight requests
app.options('*', cors());

// db:
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB not connected: ', err))

const SPOTIFY_Key = process.env.SPOTIFY_ID;
const SPOTIFY_Secret = process.env.SPOTIFY_SECRET;

const { searchSpotify, getTrackInfo, getPlaylistTracks, getMyPlaylistTracks, getNewReleases, apiCallWithRetry } = require('./src/spotify_connect');
const { getLyrics } = require('./src/get_lyrics');
const { getSpotifyAccessToken } = require('./src/spotify_auth');
// const { downloadImages } = require('./download_images')


const PORT = process.env.PORT || 8080;
const redirect_uri = 'http://localhost:8080/callback'

// Serve the static files from the React app
// change to dist later when done
app.use(express.static(path.join(__dirname, '../../client/dist')));


// get spotify access token on page to be used on all requests by 1 client
let spotifyAccessToken = '';


// Get Access token for NON-Spotify Users
app.use(async (req, res, next) => {
  if (!spotifyAccessToken) {
    try {
      spotifyAccessToken = await getSpotifyAccessToken();
    } catch (error) {
      return res.status(500).send('Failed to get Spotify access token');
    }
  }
  req.spotifyAccessToken = spotifyAccessToken;
  next();
});

// Workflow:
    // 1. user looks up artist, song, or artist and song
    // 2. top 10 results through spotify search api
    // 3. user can choose a song from search which will direct to azapi_script to get lyrics
    //      AND spotify song_id to display more song information
    //
    // 1. home page shows various spotify api queries including ...
    //  a.  songs within spotify playlist "Top 50"
    //  b.  songs in albums from new releases using '/browse/new-releases'


// SPOTIFY API FUNCTIONS:
// Search
app.get('/api/search', async (req, res) => {

  const { query, type = 'track' } = req.query;
  try {
    const data = await apiCallWithRetry(spotifyAccessToken, (token) => searchSpotify(query, token, type), (newToken) => {
      // SAVE TO USER PROFILE INSTEAD
      spotifyAccessToken = newToken;
    });
    res.json(data);
  } catch (error) {
    res.status(500).send('Error searching Spotify');
  }
});

// Track Information
app.get('/api/track/:id', async (req, res) => {
  console.log('got to api/track');
  const trackId = req.params.id;
  try {
    const trackInfo = await apiCallWithRetry(spotifyAccessToken, (token) => getTrackInfo(trackId, token), (newToken) => {
      // SAVE TO USER PROFILE INSTEAD
      spotifyAccessToken = newToken;
    });

    res.json(trackInfo);
  } catch (error) {
    res.status(500).send('Error fetching track info and lyrics');
  }
});

// Lyrics
app.get('/api/lyrics', async (req, res) => {
  const { artistName, trackName } = req.query;
  console.log('got to api/lyrics');
  // decode components, commas, exclamations for api call
  const artist = decodeURIComponent(artistName);
  const track = decodeURIComponent(trackName);

  if (!artistName || !trackName) {
    return res.status(400).send('Missing artistName or trackName');
  }

  const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`;

  request(url, function (error, response, body) {
    if (error) {
      return res.status(500).json({ error: 'Error fetching lyrics' });
    }

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ error: 'Lyrics not found' });
    }

    
    res.json(body);
  });
});

// Playlist Tracks
// ex: Top 50 Global Songs
app.get('/api/playlist/:id', async (req, res) => {
  // get id content from params
  const playlistId = req.params.id;
  try {
    const data = await apiCallWithRetry(spotifyAccessToken, 
      (token) => getPlaylistTracks(playlistId, token), (newToken) => {
      spotifyAccessToken = newToken;
    });
    res.json(data);
  } catch (error) {
    res.status(500).send('Error getting playlist tracks');
  }
});




// Direct routing to react client side router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

app.listen(PORT, function() {
    console.log('Listening on http://localhost:'+PORT);
});