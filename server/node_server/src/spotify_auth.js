//
// Bella Fishman
// Connects to Spotify API and gets access token
// runs on page load and stores Spotify token on session storage to avoid excessive api token calls

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { UserModel } = require('../models/Users');
const querystring = require('node:querystring'); 
const qs = require('qs');


const SPOTIFY_Key = process.env.SPOTIFY_ID;
const SPOTIFY_Secret = process.env.SPOTIFY_SECRET;
const redirect_uri = 'http://localhost/8080/callback';
const tokenUrl = 'https://accounts.spotify.com/api/token';


// server - server authentication flow
async function getSpotifyAccessToken() {
    
    const data = 'grant_type=client_credentials';
  
    try {
      const response = await axios.post(tokenUrl, data, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_Key + ':' + SPOTIFY_Secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
  
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting Spotify access token:', error.response ? error.response.data : error.message);
      throw error;
    }
}



  
module.exports = { getSpotifyAccessToken };