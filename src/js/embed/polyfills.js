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

function loadObjectFitImages () {
  return import('object-fit-images').then(function (module) {
    const objectFitImages = module.default || module;
    Array.from(document.querySelectorAll('picture')).forEach(function (el) {
      objectFitImages(el);
    });
  });
}

if (!('CustomEvent' in window &&
// In Safari, typeof CustomEvent == 'object' but it otherwise works fine
(typeof window.CustomEvent === 'function' ||
  (window.CustomEvent.toString().includes('CustomEventConstructor'))))) {
  require('custom-event-polyfill');
}

if (!('DOMTokenList' in window && (function (x) {
  return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
})(document.createElement('x')))) {
  require('domtokenlist-shim');
}

if (!('requestIdleCallback' in window)) {
  require('requestidlecallback');
}
