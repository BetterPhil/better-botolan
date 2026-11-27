/**
 * Registers the service worker and surfaces an "update available" signal.
 *
 * Registered only in production builds (a service worker fighting Vite's dev
 * HMR causes confusing reloads). The update flow is explicit, not automatic:
 * when a new worker is waiting, we dispatch a `bb:sw-update` event that the
 * UpdatePrompt component listens for, so the user chooses when to refresh.
 */

export const SW_UPDATE_EVENT = 'bb:sw-update';

let waitingWorker: ServiceWorker | null = null;

/** Called by the UI when the user accepts the update. */
export function applyUpdate() {
  if (!waitingWorker) {
    window.location.reload();
    return;
  }
  // Reload once the new worker takes control.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
}

function emitUpdate(worker: ServiceWorker) {
  waitingWorker = worker;
  window.dispatchEvent(new CustomEvent(SW_UPDATE_EVENT));
}

export function registerSW() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        // A worker already waiting (previous visit left an update pending).
        if (reg.waiting && navigator.serviceWorker.controller) {
          emitUpdate(reg.waiting);
        }

        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              emitUpdate(installing);
            }
          });
        });
      })
      .catch(() => {
        // Registration failing just means no offline support; the app is fine.
      });
  });
}
