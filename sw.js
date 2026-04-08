var CACHE_VERSION = 'v' + Date.now();

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // Clear all old caches on activate
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'FormAI', {
      body: data.body || 'Time to check in on your daily goals!',
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'formai-reminder',
      renotify: true,
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action !== 'dismiss') {
    e.waitUntil(clients.openWindow('/'));
  }
});
