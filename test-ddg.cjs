const fetchAndMatch = async () => {
  try {
    const query = encodeURIComponent('site:youtube.com perfect ed sheeran');
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://html.duckduckgo.com/html/?q=' + query)}`;
    const r = await fetch(url);
    const text = await r.text();
    const match = text.match(/v%3D([a-zA-Z0-9_-]{11})/); // URL encoded
    const match2 = text.match(/v=([a-zA-Z0-9_-]{11})/);
    console.log(`DDG: ${match ? match[1] : (match2 ? match2[1] : 'NOT FOUND (length: ' + text.length + ')')}`);
    if (!match && !match2) {
      console.log(text.substring(0, 1500));
    }
  } catch (e) {
    console.log(`Error - ${e.message}`);
  }
};

fetchAndMatch();
