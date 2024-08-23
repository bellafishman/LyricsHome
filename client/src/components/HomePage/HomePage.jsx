import React from 'react'
import { useEffect, useState } from 'react' 
import Suggestions from './Suggestions'
import HomeHeader from './HomeHeader'
import { useNavigate } from 'react-router-dom'; 

export default function HomePage() {
  // change once in production!!!!!
  const apiUrl = import.meta.env.VITE_API_URL;

  

  // Handle Different API Calls for Suggested Songs, Artists ...
  const handleApiCall = async (type, id = null) => {
    // change url based on type inputted
    let url = '';
  
    if (type === 'playlist') {
      url = `${apiUrl}/api/playlist/${id}`;
    } 
    else if (type === 'my-playlists') {
      url = `${apiUrl}/api/my-playlists`;
    } 
    else if (type === 'new-releases') {
      url = `${apiUrl}/api/new-releases`;
    } 
    else {
      // handle other cases or set a default
      url = `${apiUrl}/api/default-endpoint`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      // Process or set the state with the data
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <div>
      
      <HomeHeader 
      />
      
    
      
      <div className='suggestions'>
        {/*Top 50*/}
        <Suggestions 
          handleApiCall={() => handleApiCall("playlist", "37i9dQZF1DXcBWIGoYBM5M")}
        /> 
        {/*New Music Friday*/}
        <Suggestions 
          handleApiCall={() => handleApiCall("playlist", "37i9dQZF1DX4JAvHpjipBk")}
        />
        {/*Hot Country*/}
        <Suggestions 
          handleApiCall={() => handleApiCall("playlist", "37i9dQZF1DX1lVhptIYRda")}
        />
        {/*Rap Caviar*/} 
        <Suggestions 
          handleApiCall={() => handleApiCall("playlist", "37i9dQZF1DX0XUsuxWHRQd")}
        />

      </div>

    </div>
  )
}
