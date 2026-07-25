fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'))
  .then(r=>r.text())
  .then(d=>{ 
    const m = d.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/); 
    console.log(m?m[1]:'no match'); 
  })
  .catch(console.error);
