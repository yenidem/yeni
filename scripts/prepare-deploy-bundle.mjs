/**
 * YENİDEM — Vercel, Cloudflare Pages & GitHub Pages Post-Build Bundle Finalizer
 * ------------------------------------------------------------------------------
 * In Angular 21 with `"outputMode": "server"`, `ng build` outputs:
 *   - dist/app/browser/index.csr.html
 *   - dist/app/server/server.mjs
 *
 * Vercel Static CDN & SPA Rewrites expect `dist/app/browser/index.html` to exist.
 * This script deterministically:
 *   1. Copies `index.csr.html` -> `index.html` and `404.html`
 *   2. Generates `.nojekyll` and `_redirects` for multi-cloud compatibility
 *   3. Computes a SHA3-512 + BLAKE2b-512 cryptographic manifest (`deploy-manifest.json`)
 */

import { existsSync, copyFileSync, writeFileSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const rootDir = process.cwd();
const browserDir = join(rootDir, 'dist', 'app', 'browser');
const serverDir = join(rootDir, 'dist', 'app', 'server');

if (!existsSync(browserDir)) {
  console.error('[YENİDEM-DEPLOY] HATA: dist/app/browser bulunamadı. Önce `ng build` çalıştırılmalıdır.');
  process.exit(1);
}

const csrHtml = join(browserDir, 'index.csr.html');
const indexHtml = join(browserDir, 'index.html');
const notFoundHtml = join(browserDir, '404.html');

if (existsSync(csrHtml)) {
  copyFileSync(csrHtml, indexHtml);
  copyFileSync(csrHtml, notFoundHtml);
  console.log('[YENİDEM-DEPLOY] ✓ index.csr.html -> index.html & 404.html kopyalandı (Vercel & SPA 404 Koruması Aktif).');
} else if (existsSync(indexHtml) && !existsSync(notFoundHtml)) {
  copyFileSync(indexHtml, notFoundHtml);
  console.log('[YENİDEM-DEPLOY] ✓ index.html -> 404.html kopyalandı.');
}

// Write .nojekyll & _redirects for multi-cloud edge compatibility
writeFileSync(join(browserDir, '.nojekyll'), '', 'utf8');
writeFileSync(
  join(browserDir, '_redirects'),
  '/api/* /api/index.mjs 200\n/* /index.html 200\n',
  'utf8'
);

// Build SHA3-512 & BLAKE2b-512 bundle integrity manifest
const filesSummary = [];
for (const entry of readdirSync(browserDir)) {
  const fullPath = join(browserDir, entry);
  const st = statSync(fullPath);
  if (st.isFile() && /\.(html|js|css|svg|json)$/i.test(entry)) {
    const buf = readFileSync(fullPath);
    const sha3 = createHash('sha3-512').update(buf).digest('hex');
    filesSummary.push({
      file: entry,
      bytes: st.size,
      sha3_512: `0x${sha3.substring(0, 48)}...`,
    });
  }
}

const serverBundleExists = existsSync(join(serverDir, 'server.mjs'));
const manifestPayload = {
  platform: 'Vercel Edge CDN + Serverless Node.js 22 SSR + Cloudflare D1 Ready',
  builtAtUtc: new Date().toISOString(),
  indexHtmlReady: existsSync(indexHtml),
  notFoundHtmlReady: existsSync(notFoundHtml),
  serverBundleReady: serverBundleExists,
  bundleFilesCount: filesSummary.length,
  files: filesSummary,
};

const manifestRaw = JSON.stringify(manifestPayload, null, 2);
const manifestSha3 = createHash('sha3-512').update(manifestRaw).digest('hex');
const manifestBlake2b = createHash('blake2b512').update(manifestRaw).digest('hex');

writeFileSync(
  join(browserDir, 'deploy-manifest.json'),
  JSON.stringify(
    {
      ...manifestPayload,
      manifestSha3_512: `0x${manifestSha3}`,
      manifestBlake2b512: `0x${manifestBlake2b}`,
    },
    null,
    2
  ),
  'utf8'
);

console.log(
  `[YENİDEM-DEPLOY] ✓ Vercel Üretim Paketi Hazır! (${filesSummary.length} dosya mühürlendi · Server SSR: ${serverBundleExists ? 'AKTİF' : 'STATİK'})`
);
