// Service worker της εφαρμογής: πρώτα το δίκτυο (πάντα η τελευταία έκδοση), αποθήκευση για όταν πέφτει η σύνδεση.
// Δεν αγγίζει τις κλήσεις στη βάση (supabase.co) — αυτές πάνε πάντα κατευθείαν.
const CACHE = 'kalenda-v1';
const SHELL = ['./', './index.html', './themes.js', './manifest.webmanifest', './icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
