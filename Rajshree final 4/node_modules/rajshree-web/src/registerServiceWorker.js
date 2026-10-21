/**
 * Experiment 2 d: Implement PWA features
 * Registers the service worker and monitors network connectivity.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  // Global connectivity change listeners
  window.addEventListener('online', () => {
    window.dispatchEvent(
      new CustomEvent('rajshree:connectivity', {
        detail: { online: true, message: 'Internet connection restored.' }
      })
    );
    console.log('[PWA] Network status: Online');
  });

  window.addEventListener('offline', () => {
    window.dispatchEvent(
      new CustomEvent('rajshree:connectivity', {
        detail: { online: false, message: 'You are currently offline. Running cached app shell.' }
      })
    );
    console.warn('[PWA] Network status: Offline. App shell and offline cache active.');
  });

  // Safe check for production / modern browser environment
  const isProd =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.PROD
      : typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

  if ('serviceWorker' in navigator && (isProd || window.location.protocol === 'https:')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] ServiceWorker registered successfully with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] ServiceWorker registration failed:', error);
        });
    });
  }
}
