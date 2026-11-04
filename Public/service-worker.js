
const CACHE_NAME = "study-buddy-v1";

const APP_FILES = [
  "/",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: save the main app files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old app caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve saved app files when possible
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests from this website
  if (request.method !== "GET" ||
      url.origin !== self.location.origin) {
    return;
  }

  // Never cache API requests or task data
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // For page navigation, prefer the network
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put("/", copy));
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match("/")) ||
            new Response("You are offline. Please reconnect to the internet.", {
              headers: { "Content-Type": "text/plain" }
            });
        })
    );
    return;
  }

  // For app assets, use cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request);
    })
  );
});
