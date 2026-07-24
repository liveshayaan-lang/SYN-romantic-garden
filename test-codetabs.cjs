fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'))
  .then(r => r.text())
  .then(html => { 
    const match = html.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/); 
    console.log("Found:", match ? match[1] : 'not found'); 
  })
  .catch(console.error);
