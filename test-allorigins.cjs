fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'))
  .then(r=>r.json())
  .then(d=>{ 
    const m = d.contents.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/); 
    console.log(m?m[1]:'no match'); 
  })
  .catch(console.error);
