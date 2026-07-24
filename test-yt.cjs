fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'))
  .then(r => r.json())
  .then(data => { 
    const match = data.contents.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/); 
    console.log("Found:", match ? match[1] : 'not found'); 
  })
  .catch(console.error);
