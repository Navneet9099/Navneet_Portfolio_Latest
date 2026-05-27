/**
 * Zero-dependency Node.js Local Development Server
 * Serves static files with correct MIME types for portfolio local testing.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces/special characters
  const decodedUrl = decodeURI(req.url);

  // Resolve filepath (default to index.html for root path)
  let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);

  // Security check to prevent traversing outside directory
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Forbidden');
    return;
  }

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  let contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Page not found: serve custom 404 or simple plain text
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
      } else {
        // Server error
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Internal Server Error: ${error.code}`);
      }
    } else {
      // Success response
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);

      // Force attachment download for PDF files
      if (ext === '.pdf') {
        res.setHeader('Content-Disposition', 'attachment; filename="Navneet_Kesarwani_Resume.pdf"');
      }

      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🚀 Portfolio Dev Server Active`);
  console.log(`👉 Local:   http://localhost:${PORT}/`);
  console.log('========================================\n');
});
