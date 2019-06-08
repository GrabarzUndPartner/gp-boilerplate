import parser from './services/parser';

import 'jquery/../event';
import 'jquery/../event/trigger';
import 'jquery/../data';

import 'lazysizes';

parser.parse();

/**
 * PWA
 */
if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'build') && document.querySelector('link[rel="manifest"]')) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('service-worker.js', {
          scope: 'js/'
        })
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}
