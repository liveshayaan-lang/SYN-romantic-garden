const instances = [
  'https://invidious.nerdvpn.de',
  'https://invidious.slipfox.xyz',
  'https://invidious.weblibre.org',
  'https://invidious.privacydev.net',
  'https://invidious.perennialte.ch',
  'https://invidious.lunar.icu',
  'https://invidious.poast.org',
  'https://vid.puffyan.us',
  'https://yewtu.be'
];

(async () => {
  for (let url of instances) {
    try {
      const res = await fetch(`${url}/api/v1/search?q=perfect+ed+sheeran&type=video`, { timeout: 3000 });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          console.log(`WORKED: ${url} -> ${data[0].videoId}`);
          return;
        }
      }
    } catch(e) {
      // ignore
    }
  }
  console.log('NONE WORKED');
})();
