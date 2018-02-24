const CACHE_NAME = 'v2';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/demo.css',
  './css/intlTelInput.css',
  './js/script.js',
  './js/app.js',
  './js/intlTelInput.min.js',
  './js/utils.js',
  './img/flags.png',
  './img/flags@2x.png'
];
const FILES_NOT_TO_FETCH = [
  'https://www.googletagmanager.com/gtag/js?id=UA-100343895-3',
  'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
  'https://www.google-analytics.com/analytics.js'
];
const ANALYTICS_STRING = 'google-analytics';
const IPINFO_STRING = 'ipinfo';

self.addEventListener('install', function(e) {
  console.log('Installing!');

  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching the cacheFiles');
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('Activating!');

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== CACHE_NAME) {
            console.log('Removing cached files from ', thisCacheName);
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('Fetching!');

  if (
    FILES_NOT_TO_FETCH.indexOf(e.request.url) > -1 ||
    e.request.url.indexOf(ANALYTICS_STRING) > -1 ||
    e.request.url.indexOf(IPINFO_STRING) > -1
  ) {
    console.log('Not fetching/caching', e.request.url);
    return;
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        if (response) {
          console.log('Found resource in cache', e.request.url);
          // console.log("I am the response", response);
          return response;
        }

        var requestClone = e.request.clone();
        fetch(requestClone)
          .then(function(response) {
            if (!response) {
              console.log('No response from fetch');
              return response;
            }

            var responseClone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(e.request, responseClone);
              return response;
            });
          })
          .catch(function(err) {
            console.log('Error fetching and caching new data', err);
          });
      })
    );
  }
});
