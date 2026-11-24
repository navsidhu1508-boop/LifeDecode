import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

// Custom Vite plugin to serve /api serverless functions in local dev mode
function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname.startsWith('/api/')) {
          const routeName = pathname.replace('/api/', '').split('?')[0];

          try {
            let handlerModule;
            if (routeName === 'decode') {
              handlerModule = await import('./api/decode.js');
            } else if (routeName === 'chat') {
              handlerModule = await import('./api/chat.js');
            } else if (routeName === 'contact') {
              handlerModule = await import('./api/contact.js');
            } else if (routeName === 'config-check') {
              handlerModule = await import('./api/config-check.js');
            } else {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }

            // Read request body for POST requests
            let body = {};
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              if (data) {
                try {
                  body = JSON.parse(data);
                } catch (e) {
                  body = {};
                }
              }
            }

            // Adapt req and res to mimic Vercel Serverless environment
            req.body = body;
            req.query = parsedUrl.query;

            const originalStatus = res.status;
            res.status = function (code) {
              res.statusCode = code;
              return res;
            };

            const originalJson = res.json;
            res.json = function (jsonObj) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(jsonObj));
              return res;
            };

            await handlerModule.default(req, res);
          } catch (err) {
            console.error('API Error in local dev:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
