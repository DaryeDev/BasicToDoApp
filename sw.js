const CACHE_NAME = 'todo-pwa-v1';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './td.svg',
    // Basic icons so install UI has something; rest will be cached on demand
    './icons/android/android-launchericon-192-192.png',
    './icons/android/android-launchericon-512-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.map((k) => (k === CACHE_NAME ? undefined : caches.delete(k)))
        ))
    );
    self.clients.claim();
});

// Helper: detect navigation requests
function isNavigationRequest(request) {
    return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // App Shell for navigations: network-first with fallback to cached index.html
    if (isNavigationRequest(request)) {
        event.respondWith(
            fetch(request)
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    // Static assets: cache-first, then network and cache
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request)
                    .then((response) => {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                        return response;
                    })
                    .catch(() => cached);
            })
        );
    }
});


