/** Optional zero-dependency static preview server with clean route fallback. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2', '.woff':'font/woff' };
const port = Number(process.env.PORT || 5173);
createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    const requested = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!requested.startsWith(root+sep) && requested!==root) {res.writeHead(403).end();return;}
    if (url.pathname.split('/').some(part=>part.startsWith('.')) || url.pathname.startsWith('/api/')) {res.writeHead(404).end('Not found');return;}
    let file = requested;
    try { if (!(await stat(file)).isFile()) file=resolve(root,'index.html'); }
    catch { if(extname(file)){res.writeHead(404).end('Not found');return;} file=resolve(root,'index.html'); }
    const content=await readFile(file);
    res.writeHead(200,{'Content-Type':(types[extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:content);
  } catch {res.writeHead(400).end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`MurhoPrints: http://localhost:${port}`));
