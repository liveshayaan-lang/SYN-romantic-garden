import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import https from 'https';

export default defineConfig({
  base: '/SYN-romantic-garden/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'youtube-search-api',
      configureServer(server) {
        server.middlewares.use('/api/search', (req, res) => {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          const query = url.searchParams.get('q');
          if (!query) {
            res.statusCode = 400;
            res.end('Missing query');
            return;
          }
          const searchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
          https.get(searchUrl, (ytRes) => {
            let body = '';
            ytRes.on('data', chunk => body += chunk);
            ytRes.on('end', () => {
              const match = body.match(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/);
              const videoId = match ? match[1] : '2Vv-BfVoq4g'; // Fallback
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ videoId }));
            });
          }).on('error', (err) => {
            res.statusCode = 500;
            res.end(err.message);
          });
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
