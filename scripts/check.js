/** No-dependency checks for the static frontend and its local import graph. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function files(dir) { return readdirSync(dir, {withFileTypes:true}).flatMap(e=>e.isDirectory()?files(resolve(dir,e.name)):[resolve(dir,e.name)]); }
const source=files(resolve(root,'js'));
for(const file of [...source,resolve(root,'server.js')]) {
  execFileSync(process.execPath,['--check',file]);
  const text=readFileSync(file,'utf8');
  for(const match of text.matchAll(/^import\s+(?:[^;\n]*?from\s*)?['"]([^'"]+)['"]/gm)) {
    const specifier=match[1];
    if(specifier.startsWith('node:'))continue;
    assert(specifier.startsWith('.')||specifier.startsWith('/'),'External module '+specifier);
    const target=specifier.startsWith('/')?resolve(root,'.'+specifier):resolve(dirname(file),specifier);
    assert(existsSync(target),`${relative(root,file)}: missing import ${specifier}`);
  }
  if(!file.includes('/vendor/'))assert(!/\bfetch\s*\(|\blocalStorage\b|\bsessionStorage\b|supabase|razorpay/i.test(text),'Unexpected backend/storage code: '+file);
}
for(const dir of ['js/app/admin','js/app/auth','js/app/login','js/app/signup','js/app/profile','js/app/checkout','js/services','js/lib/supabase'])assert(!existsSync(resolve(root,dir)),'Removed feature remains: '+dir);
const documents=[...source.filter(f=>!f.includes('/vendor/')),...files(resolve(root,'css')),resolve(root,'index.html')];
for(const file of documents){const text=readFileSync(file,'utf8');for(const m of text.matchAll(/["'(](\/(?:images|fonts|css|heropage)\/[^"'()\s]+|\/murhoprints-wordmark.svg|\/favicon.svg)["')]/g))assert(existsSync(resolve(root,'.'+m[1])),`${relative(root,file)}: missing asset ${m[1]}`);}
const {products,categories}=await import('../js/data/products.js');
assert.equal(products.length,6);assert.equal(new Set(products.map(p=>p.id)).size,6);
for(const p of products){assert(p.price>0);assert(p.description&&p.material_details);assert.equal(p.product_variants.length,4);assert(existsSync(resolve(root,'.'+p.img)));assert(p.product_categories.every(c=>categories.some(cat=>cat.id===c.category_id)));}
console.log(`PASS: ${source.length} JavaScript modules, local imports/assets, six products, and removed backend features.`);
