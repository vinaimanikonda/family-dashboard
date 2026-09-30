/* Bump this version after changing any bundled file. Relative paths support GitHub project pages. */
var CACHE='our-day-shell-v2';
var FILES=['./','./index.html','./styles.css','./data.js','./app.js','./favicon.svg'];
self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE).then(function(cache){return cache.addAll(FILES);}));});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(key){return key.indexOf('our-day-shell-')===0&&key!==CACHE;}).map(function(key){return caches.delete(key);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(event){if(event.request.method!=='GET'||event.request.url.indexOf(self.registration.scope)!==0){return;}event.respondWith(caches.match(event.request).then(function(cached){return cached||fetch(event.request);}));});
