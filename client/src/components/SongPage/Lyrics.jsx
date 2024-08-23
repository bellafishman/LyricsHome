import React from 'react'

export default function Lyrics(props) {
  const {lyrics } = props;
  

  if (!lyrics) {
    console.log('no lyrics passed to Lyrics');
    return;
  }

  const normalizedLyrics = lyrics.replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n\n');
  const lyricLines = normalizedLyrics.split('\\n');
  const filteredLines = lyricLines.slice(1);

  return (
    <div className='lyrics'>
      {filteredLines.map((line, index) => {
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
