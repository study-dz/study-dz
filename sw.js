const CACHE='study-dz-century-v4';
const CORE=['./','./index.html','./style.css','./js/app.js','./js/users.js','./js/quran.js','./js/century.js','./manifest.webmanifest'];

// Do NOT precache large Quran audio files. They can make app installation
// appear stuck for a very long time on slow connections.
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(r=>{
      if(r) return r;
      return fetch(e.request).then(x=>{
        const copy=x.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        return x;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});
