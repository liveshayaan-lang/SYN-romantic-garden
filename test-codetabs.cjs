const fetchAndMatch = async (name, url) => {
  try {
    const r = await fetch(url);
    const text = await r.text();
    const match = text.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/);
    console.log(`${name}: ${match ? match[1] : 'NOT FOUND (length: ' + text.length + ')'}`);
    if (!match) {
      console.log(text.substring(0, 1500));
    }
  } catch (e) {
    console.log(`${name}: Error - ${e.message}`);
  }
};

const ytUrl = encodeURIComponent('https://www.youtube.com/results?search_query=perfect+ed+sheeran');

(async () => {
  await fetchAndMatch('codetabs', `https://api.codetabs.com/v1/proxy/?quest=https://www.youtube.com/results?search_query=perfect+ed+sheeran`);
})();
