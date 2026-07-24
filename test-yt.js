const https = require('https');

https.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'), (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    const json = JSON.parse(data);
    const match = json.contents.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    console.log("MATCH:", match ? match[1] : 'not found');
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
