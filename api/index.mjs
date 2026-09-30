/**
 * YENİDEM — Vercel Serverless Function Entry Point (/api/index.mjs)
 * -----------------------------------------------------------------
 * Bridges all `/api/*` and SSR requests on Vercel to the compiled
 * Angular 21 + Express + Post-Quantum Security server (`dist/app/server/server.mjs`).
 */

let cachedHandler = null;

async function getServerHandler() {
  if (cachedHandler) {
    return cachedHandler;
  }
  const serverModule = await import('../dist/app/server/server.mjs');
  cachedHandler = serverModule.reqHandler || serverModule.app || serverModule.default;
  return cachedHandler;
}

export default async function handler(req, res) {
  res.setHeader('X-Yenidem-Vercel-Runtime', 'Node22-Serverless-PQC-Active');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  try {
    const fn = await getServerHandler();
    if (typeof fn === 'function') {
      return fn(req, res);
    }
    res.status(500).json({
      success: false,
      error: 'YENİDEM sunucu işleyicisi (reqHandler) başlatılamadı.',
    });
  } catch (err) {
    console.error('[Vercel Serverless Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Vercel Serverless çalışma zamanı hatası oluştu.',
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
