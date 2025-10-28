const CACHE_NAME = 'bs-express-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Erreur lors du cache:', error);
      })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Ne pas mettre en cache les requêtes Firebase
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la réponse du cache si disponible
        if (response) {
          return response;
        }
        // Sinon, fait la requête réseau
        return fetch(event.request).then((response) => {
          // Vérifie que la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone la réponse
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Retourne une page hors ligne si disponible
        return caches.match('/index.html');
      })
  );
});