const instances = [
  'https://pipedapi.tokhmi.xyz',
  'https://piped-api.garudalinux.org',
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.drgns.space'
];

(async () => {
  for (let url of instances) {
    try {
      const res = await fetch(`${url}/search?q=perfect+ed+sheeran&filter=all`, { timeout: 3000 });
      if (res.ok) {
        const text = await res.text();
        if (text.startsWith('{')) {
          const data = JSON.parse(text);
          if (data.items && data.items.length > 0) {
            console.log(`WORKED: ${url} -> ${data.items[0].url}`);
            return;
          }
        }
      }
    } catch(e) {
      // ignore
    }
  }
  console.log('NONE WORKED');
})();
