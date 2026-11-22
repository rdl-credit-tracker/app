/* RDL service worker: network-first, so users always get the newest app; cache is only an offline fallback. */
var C='rdl-shell-v3';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;   // never touch Google / Apps Script calls
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
    return res
  }).catch(function(){return caches.match(r).then(function(h){return h||caches.match('./')||caches.match('index.html')})}))});
