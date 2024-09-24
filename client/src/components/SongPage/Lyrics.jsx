import React from 'react'

export default function Lyrics(props) {
  const { lyrics } = props;
  

  if (!lyrics) {
    console.log('no lyrics passed to Lyrics');
    return;
  }
  //console.log(lyrics);
  const parsedLyrics = lyrics.split('\n');

  return (
    <div className='lyrics'>
      {parsedLyrics.map((line, index) => {
        // for line breaks 
        if (line.trim() === '') {
          // Render an empty <p> for line breaks
          return <p key={index} className='lyric-break'></p>;
        }
        return (
          <div key={index} >
            <button 
              className='lyric-line' >
                <p>{line}</p>
            </button>
          </div>
        );
      })}      
    </div>
  )
}
