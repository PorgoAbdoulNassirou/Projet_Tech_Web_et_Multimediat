/*
 * Service worker de Soalma : garde les pages et les récits consultables
 * avec une connexion faible ou absente.
 * Pages HTML : réseau d'abord, cache en secours.
 * Fichiers statiques : cache d'abord, mis à jour en arrière-plan.
 */
const VERSION = 'soalma-v5';
const CORE = [
  './', 'index.html', 'carte.html', 'contes.html', 'conte.html', 'a-propos.html',
  'assets/css/main.css',
  'assets/js/data.js', 'assets/js/scenes.js', 'assets/js/ui.js', 'assets/js/icons.js',
  'assets/js/home.js', 'assets/js/library.js', 'assets/js/reader.js', 'assets/js/map.js',
  'assets/js/geo.js', 'assets/js/narrator.js', 'assets/js/ambience.js',
  'assets/img/logo.svg', 'assets/img/favicon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
    );
    return;
  }

  const sameOrigin = url.origin === location.origin;
  const fonts = url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com');
  if (!sameOrigin && !fonts) return;
  if (url.pathname.endsWith('.mp3')) return; // les enregistrements sont lus en flux

  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res.ok || res.type === 'opaque') caches.open(VERSION).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;
    }),
  );
});
