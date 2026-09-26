// Local preview server for dist/ (no dependencies). Usage: node scripts/serve.js [port]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const root = join(import.meta.dirname, '..', 'dist');
const port = Number(process.argv[2] || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

http.createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
  let file = join(root, path);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  if (req.method === 'POST' && path.endsWith('send-order.php')) { // PHP isn't available locally – pretend success
    res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"ok":true,"preview":true}'); return;
  }
  const read = (f) => readFile(f).catch(() => null);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch {}
  const body = await read(file);
  if (body) {
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
    return;
  }
  const notFound = await read(join(root, '404.html'));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(notFound || '<p style="font:18px sans-serif;padding:40px">Elisa Motors is being built… refresh in a minute.</p>');
}).listen(port, () => console.log(`Preview: http://localhost:${port}`));
