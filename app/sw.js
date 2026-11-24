// CAL – service worker. Nič neukladá do cache (vždy čerstvá verzia).
// Slúži na inštaláciu na plochu a na webové notifikácie (Web Push).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

// Prišla notifikácia zo servera (Edge Function „push“).
self.addEventListener('push', (e) => {
  let d = {};
  try {
    d = e.data ? e.data.json() : {};
  } catch (err) {
    d = { body: e.data ? e.data.text() : '' };
  }
  const base = self.registration.scope; // napr. https://…/cal-web/app/
  const url = d.eventId ? base + 'akcia/' + d.eventId : d.actorId ? base + 'clovek/' + d.actorId : base + 'upozornenia';
  e.waitUntil(
    self.registration.showNotification(d.title || 'CAL', {
      body: d.body || '',
      icon: base + 'icon-192.png',
      badge: base + 'icon-192.png',
      data: { url: url },
    }),
  );
});

// Ťuknutie na notifikáciu: otvoríme akciu (alebo profil) v CAL.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (list) => {
      for (const c of list) {
        try {
          await c.focus();
          if (c.navigate) await c.navigate(url);
          return;
        } catch (err) {
          // skúsime otvoriť nové okno
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
