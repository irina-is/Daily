/* ---------- service worker: офлайн-режим ----------
   Кеширует приложение, чтобы оно открывалось и работало без интернета.
   Стратегия для своих файлов — stale-while-revalidate: сразу отдаём из кеша
   (быстро и работает офлайн), а в фоне подтягиваем свежую версию — так после
   обновления файлов на хостинге новая версия подхватится при следующем запуске. */
const CACHE = 'ritual-v1';
const SHELL = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts — cache-first (шрифты практически не меняются)
  if(url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'){
    e.respondWith(
      caches.open(CACHE).then(async (c)=>{
        const hit = await c.match(req);
        if(hit) return hit;
        try{
          const res = await fetch(req);
          c.put(req, res.clone());
          return res;
        }catch(err){
          return hit || Response.error();
        }
      })
    );
    return;
  }

  // свои файлы — stale-while-revalidate
  if(url.origin === location.origin){
    e.respondWith(
      caches.open(CACHE).then(async (c)=>{
        const hit = await c.match(req);
        const net = fetch(req)
          .then((res)=>{ if(res && res.status === 200) c.put(req, res.clone()); return res; })
          .catch(()=> hit || (req.mode === 'navigate' ? c.match('./index.html') : Response.error()));
        return hit || net;
      })
    );
  }
});
