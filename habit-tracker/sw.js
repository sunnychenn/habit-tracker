// 離線快取：有網路時一律抓最新版（更新網站會馬上生效），沒網路時才用手機上的備份
// 注意：這個檔案只快取網頁本身，你的打卡資料存在別的地方，不受影響
const CACHE = 'habit-tracker-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
