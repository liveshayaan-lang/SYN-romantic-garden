fetch('https://corsproxy.io/?' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'))
  .then(r=>r.text())
  .then(t=>{ 
    const m = t.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/); 
    console.log(m?m[1]:'no match'); 
  })
  .catch(console.error);
