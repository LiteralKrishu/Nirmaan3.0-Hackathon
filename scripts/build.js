/** Package the unchanged HTML/CSS/JS frontend for static hosting. */
import './check.js';
import { cpSync, mkdirSync, rmSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const entries = ['index.html', 'favicon.svg', 'murhoprints-wordmark.svg', 'js', 'css', 'fonts', 'images', 'heropage', 'licenses', 'LICENSE', 'THIRD_PARTY_NOTICES.md', '_redirects'];
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const entry of entries) cpSync(resolve(root, entry), resolve(output, entry), { recursive: true });

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
// Catch missing browser modules in the actual deployment output, not just source.
for (const file of files(resolve(output, 'js'))) {
  const contents = readFileSync(file, 'utf8');
  for (const [, specifier] of contents.matchAll(/^import\s+(?:[^;\n]*?from\s*)?['"]([^'"]+)['"]/gm)) {
    const target = specifier.startsWith('/') ? resolve(output, '.' + specifier) : resolve(dirname(file), specifier);
    assert(existsSync(target), `${relative(output, file)}: missing deployed module ${specifier}`);
  }
}
assert(!existsSync(resolve(output, 'server.js')));
assert(!existsSync(resolve(output, 'scripts')));
console.log(`Static deployment ready: ${files(output).length} files in dist/.`);
