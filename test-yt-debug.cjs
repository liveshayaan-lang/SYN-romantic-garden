const https = require('https');
https.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran'), (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const json = JSON.parse(data);
    const match = json.contents ? json.contents.match(/"videoId":"([a-zA-Z0-9_-]{11})"/) : null;
    console.log("MATCH:", match ? match[1] : 'not found');
    console.log("CONTENTS LENGTH:", json.contents ? json.contents.length : 'no contents');
    if (!match && json.contents) {
      console.log(json.contents.substring(0, 500));
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
