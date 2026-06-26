/* Transitional cleanup for browsers that already installed the old cache-first
   PWA worker. This worker does not handle fetches or cache app files. */
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (key) {
      return key === 'portal-lab-pwa' || key.indexOf('portal-lab-pwa-') === 0;
    }).map(function (key) {
      return caches.delete(key);
    }));

    await clients.claim();
    var windows = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    await Promise.all(windows.map(function (client) {
      return client.navigate(client.url);
    }));
    await self.registration.unregister();
  })());
});
