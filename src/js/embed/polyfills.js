// Load Polyfills when ie 11 for Picture and IntersectionObserver
if (navigator.userAgent.indexOf('MSIE') !== -1 ||
  navigator.appVersion.indexOf('Trident/') > -1) {
  const features = [
    'HTMLPictureElement', 'IntersectionObserver'
  ];

  const script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.polyfill.io/v2/polyfill.min.js?features=' + features.join(','));
  script.setAttribute('defer', true);
  document.head.appendChild(script);

  loadObjectFitImages();
}

// requestIdleCallback
global.requestIdleCallback = global.requestIdleCallback || function (callback) {
  setTimeout(callback, 350);
};

function loadObjectFitImages () {
  return import('object-fit-images').then(function (module) {
    const objectFitImages = module.default || module;
    Array.from(document.querySelectorAll('picture')).forEach(function (el) {
      objectFitImages(el);
    });
  });
}
