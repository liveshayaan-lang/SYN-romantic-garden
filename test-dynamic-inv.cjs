(async () => {
  try {
    const res = await fetch('https://api.invidious.io/instances.json');
    const instances = await res.json();
    const activeInstances = instances.filter(i => i[1].cors === true && i[1].api === true).map(i => i[1].uri);
    
    console.log(`Found ${activeInstances.length} active instances with CORS.`);
    
    for (let uri of activeInstances.slice(0, 5)) {
      try {
        console.log(`Testing ${uri}...`);
        const searchRes = await fetch(`${uri}/api/v1/search?q=perfect+ed+sheeran&type=video`, { timeout: 3000 });
        if (searchRes.ok) {
          const data = await searchRes.json();
          if (data && data.length > 0) {
            console.log(`SUCCESS with ${uri}: ${data[0].videoId}`);
            return;
          }
        }
      } catch(e) {
        console.log(`Failed ${uri}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
})();
