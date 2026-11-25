import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Handle /api/* serverless routes
  if (pathname.startsWith('/api/')) {
    const route = pathname.replace('/api/', '').split('?')[0].replace(/\/+$/, '');

    // Helper methods mimicking Vercel/Express
    res.status = function (code) {
      res.statusCode = code;
      return res;
    };

    res.json = function (jsonObj) {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      return res.end(JSON.stringify(jsonObj));
    };

    try {
      // Read body for POST
      let body = {};
      if (req.method === 'POST') {
        const maxBytes = 25 * 1024 * 1024;
        let totalBytes = 0;
        const buffers = [];
        for await (const chunk of req) {
          totalBytes += chunk.length;
          if (totalBytes > maxBytes) {
            return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE', message: 'Uploaded file or text exceeds the maximum allowed request size.' });
          }
          buffers.push(chunk);
        }
        const raw = Buffer.concat(buffers).toString('utf-8');
        if (raw) {
          try {
            body = JSON.parse(raw);
          } catch (e) {
            return res.status(400).json({ error: 'INVALID_JSON', message: 'Request body must be valid JSON' });
          }
        }
      }

      req.body = body;
      req.query = parsedUrl.query;

      if (route === 'decode') {
        const mod = await import('./api/decode.js');
        return await mod.default(req, res);
      } else if (route === 'chat') {
        const mod = await import('./api/chat.js');
        return await mod.default(req, res);
      } else if (route === 'contact') {
        const mod = await import('./api/contact.js');
        return await mod.default(req, res);
      } else if (route === 'config-check') {
        const mod = await import('./api/config-check.js');
        return await mod.default(req, res);
      } else {
        return res.status(404).json({ error: 'NOT_FOUND', message: `API route /api/${route} not found` });
      }
    } catch (err) {
      console.error(`Error in /api/${route}:`, err);
      return res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected server error occurred.'
      });
    }
  }

  // Serve static assets from dist
  let filePath = path.join(DIST_DIR, pathname);

  // Normalize path to prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      // Cache assets with hashes indefinitely
      if (pathname.startsWith('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }

      const stream = fs.createReadStream(filePath);
      return stream.pipe(res);
    }

    // SPA fallback: serve dist/index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    fs.readFile(indexPath, (readErr, content) => {
      if (readErr) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('File not found. Please run npm run build first.');
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.statusCode = 200;
      return res.end(content);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`LifeDecode production server running at http://${HOST}:${PORT}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
  console.log(`Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')}`);
});
