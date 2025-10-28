// Version du cache - à incrémenter à chaque publication
const CACHE_NAME = 'bs-express-v2';
const urlsToCache = [
  '/',
  '/index.html',
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
  const requestUrl = new URL(event.request.url);
  
  // Stratégie "Network First" pour le HTML (toujours récupérer la dernière version)
  if (requestUrl.pathname.endsWith('.html') || requestUrl.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la requête réseau réussit, mettre à jour le cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // En cas d'échec réseau, retourne depuis le cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Ne pas mettre en cache les requêtes Firebase
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebase')) {
    return;
  }

  // Stratégie "Stale While Revalidate" pour les autres ressources (CSS, JS, images)
  // Retourne le cache immédiatement, mais met à jour en arrière-plan
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Fait la requête réseau en parallèle pour mettre à jour le cache
        const fetchPromise = fetch(event.request)
          .then((response) => {
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
          })
          .catch(() => null); // Ignore les erreurs réseau

        // Retourne le cache immédiatement, ou attend le réseau si pas de cache
        return cachedResponse || fetchPromise;
      })
      .catch(() => {
        // En dernier recours, essaie de récupérer depuis le réseau
        return fetch(event.request).catch(() => caches.match('/index.html'));
      })
  );
});