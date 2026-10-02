// Service worker : permet d'ouvrir l'application même sans réseau.
// Stratégie : « réseau d'abord » pour les fichiers de l'app (les mises à jour
// arrivent dès qu'il y a du réseau), cache en secours si hors ligne.
// Les appels au Google Apps Script ne passent jamais par le cache.

const CACHE = 'budget-familial-v2';
const FICHIERS_APP = [
  './',
  './index.html',
  './manifest.json',
  './data.js',
  './script-url.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
const DELAI_RESEAU_MS = 3500;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FICHIERS_APP))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Police Inter (Google Fonts) : cache d'abord
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheDabord(req));
    return;
  }
  // Tout le reste hors du site (dont Google Apps Script) : réseau direct
  if (url.origin !== self.location.origin) return;

  event.respondWith(reseauDabord(req));
});

async function reseauDabord(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await avecDelai(fetch(req), DELAI_RESEAU_MS);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const enCache = await cache.match(req, { ignoreSearch: true })
      || (req.mode === 'navigate' ? await cache.match('./index.html') : null);
    if (enCache) return enCache;
    // Délai dépassé sans copie en cache : on attend quand même le réseau
    return fetch(req);
  }
}

async function cacheDabord(req) {
  const cache = await caches.open(CACHE);
  const enCache = await cache.match(req);
  if (enCache) return enCache;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
  return res;
}

function avecDelai(promesse, ms) {
  return new Promise((ok, ko) => {
    const t = setTimeout(() => ko(new Error('délai')), ms);
    promesse.then(r => { clearTimeout(t); ok(r); }, e => { clearTimeout(t); ko(e); });
  });
}
