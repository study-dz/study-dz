/* v3: was cache-first for everything, which meant a broken cached copy of
   index.html/js could get stuck on a device forever, even after the site
   was fixed and redeployed (the browser never re-checked the network for a
   URL it already had cached). Now: app files (html/js/css) are
   network-first so a fix always reaches people who have a connection, and
   only fall back to cache when offline. Static media stays cache-first. Old
   cache versions are deleted on activate so this can't happen again. */
const CACHE='study-dz-century-v6';
const CORE=['./','./index.html','./style.css','./js/app.js','./js/users.js','./js/quran.js','./js/century.js','./js/social.js','./manifest.webmanifest','./assets/audio/001.mp3','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
const APP_FILES=['./','./index.html','./style.css','./js/app.js','./js/users.js','./js/quran.js','./js/century.js','./js/social.js','./manifest.webmanifest'];

self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
));

function isAppFile(url){
  return APP_FILES.some(p=>url.endsWith(p.replace('./','/')) || url.endsWith(p));
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isNav = e.request.mode==='navigate';

  // Never intercept cross-origin requests (e.g. the externally-streamed Quran
  // audio). The browser's native network/Range handling does a better job
  // with large remote media than trying to route it through the cache API,
  // and it keeps this service worker's cache limited to the app's own files.
  if(url.origin !== self.location.origin) return;

  if(isNav || isAppFile(url.pathname)){
    // Network-first: always try to get the latest app code; only use the
    // cached copy if the network is unavailable.
    e.respondWith(
      fetch(e.request).then(x=>{
        const copy=x.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        return x;
      }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
    );
    return;
  }

  // Static assets (audio, etc.): cache-first is fine, they don't change.
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{
    const copy=x.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
    return x;
  }).catch(()=>caches.match('./index.html'))));
});
