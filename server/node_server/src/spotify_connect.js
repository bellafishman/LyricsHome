//
// Bella Fishman
// Handle interactions (GET requests) with spotify API

const axios = require('axios');
const { getSpotifyAccessToken } = require('./spotify_auth');



// Wrapper function to handle token expiration
async function apiCallWithRetry(spotifyAccessToken, apiRequestFunc) {

  try {
    // Attempt the API request with the current token
    return await apiRequestFunc(spotifyAccessToken);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token expired, get a new token
      console.log('Token expired. Getting a new token...');
      let newToken = '';

      try {
        // general user not logged into spotify:
        console.log('getting spotify access token');
        newToken = await getSpotifyAccessToken();

        // Retry the API request with the new token
        return await apiRequestFunc(newToken);
      } catch (tokenError) {
        throw new Error('Failed to refresh Spotify access token');
      }
    } else {
      throw error; // Re-throw other errors to be handled by the caller
    }
  }
}



// search spotify for tracks, artist songs, and playlist info
async function searchSpotify(query, token, type = 'track') {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching Spotify:', error.response ? error.response.data : error.message);
      throw error;
    }
}

// get specific track info
async function getTrackInfo(trackId, token) {
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting track info:', error.response ? error.response.data : error.message);
      throw error;
    }
}


// get specific track info from playlist
async function getPlaylistTracks(playlistId, token) {
    // add filters to only get relevant information
    console.log('sending to get playlist tracks from spotify');
    const url = `https://api.spotify.com/v1/playlists/${playlistId}` + '?market=ES&fields=name%2Ctracks.items%28track%28album%28images%29%2Cartists%2Cid%2Cname%29%29';
    //console.log(`Authorization header: Bearer ${token}`);
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting playlist tracks:', error.response ? error.response.data : error.message);
      throw error;
    }
}

// get specific track info from playlist
async function getMyPlaylistTracks(token) {
  // add filters to only get relevant information
  const url = 'https://api.spotify.com/v1/me/playlists?limit=3&offset=0';
  //console.log(`Authorization header: Bearer ${token}`);
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting playlist my tracks:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// get specific track info
async function getNewReleases(trackId, token) {
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting new releases:', error.response ? error.response.data : error.message);
      throw error;
    }
}


// export to be accessed in index.js for client side calls
module.exports = {
    searchSpotify,
    getTrackInfo,
    getPlaylistTracks,
    getMyPlaylistTracks,
    getNewReleases,
    apiCallWithRetry,
};

