import parser from './services/parser';

import 'jquery/../event';
import 'jquery/../event/trigger';
import 'jquery/../data';

parser.parse();

// await async test

async function asyncTest() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

async function startTest() {
    await asyncTest();
    console.log('jaaa?');
}

startTest();

if (process.env.NODE_ENV === 'production') {
    // PWA
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
