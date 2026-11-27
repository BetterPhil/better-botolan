import { useEffect, useState } from 'react';
import { Download, RefreshCw, Share, WifiOff, X } from 'lucide-react';
import { SW_UPDATE_EVENT, applyUpdate } from '../../pwa/registerSW';
import {
  INSTALL_CHANGE_EVENT,
  IOS_HINT_EVENT,
  canInstall,
  isIos,
  isStandalone,
  promptInstall,
} from '../../pwa/install';

const DISMISS_KEY = 'bb-install-dismissed-at';
const DISMISS_DAYS = 14;

function dismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (!at) return false;
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function rememberDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // a remembered dismissal is a nicety, not required
  }
}

/* ------------------------------- Offline ------------------------------- */

function OfflineBanner() {
  const [offline, setOffline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine === false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-md"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      You&rsquo;re offline — showing saved pages. Hotlines still work.
    </div>
  );
}

/* ------------------------------- Update -------------------------------- */

function UpdatePrompt() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handler = () => setReady(true);
    window.addEventListener(SW_UPDATE_EVENT, handler);
    return () => window.removeEventListener(SW_UPDATE_EVENT, handler);
  }, []);

  if (!ready) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:left-4 sm:right-auto">
      <div className="flex items-start gap-3">
        <RefreshCw
          className="mt-0.5 h-5 w-5 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            A new version is available
          </p>
          <p className="mt-0.5 text-sm text-gray-600">
            Refresh to get the latest information.
          </p>
          <button
            type="button"
            onClick={applyUpdate}
            className="mt-3 rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Refresh now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Install ------------------------------- */

function InstallPrompt() {
  const [installable, setInstallable] = useState(() => canInstall());
  const [iosHint, setIosHint] = useState(false);
  const [hidden, setHidden] = useState(() => dismissed() || isStandalone());

  useEffect(() => {
    const onChange = () => setInstallable(canInstall());
    window.addEventListener(INSTALL_CHANGE_EVENT, onChange);

    // Let the footer button ask for the iOS instructions explicitly.
    const onIosHint = () => setIosHint(true);
    window.addEventListener(IOS_HINT_EVENT, onIosHint);

    // Auto-offer the iOS hint (iOS never fires beforeinstallprompt).
    let t: number | undefined;
    if (!hidden && isIos() && !isStandalone()) {
      t = window.setTimeout(() => setIosHint(true), 2500);
    }
    return () => {
      window.removeEventListener(INSTALL_CHANGE_EVENT, onChange);
      window.removeEventListener(IOS_HINT_EVENT, onIosHint);
      if (t) window.clearTimeout(t);
    };
  }, [hidden]);

  const close = () => {
    setHidden(true);
    setIosHint(false);
    rememberDismiss();
  };

  const install = async () => {
    const outcome = await promptInstall();
    if (outcome !== 'unavailable') close();
  };

  // The iOS hint can be requested from the footer even after a dismissal.
  if (hidden && !iosHint) return null;
  if (!installable && !iosHint) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[55] mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:right-4 sm:left-auto">
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="flex items-start gap-3">
        <img
          src="/icons/icon-192.png"
          alt=""
          className="h-11 w-11 shrink-0 rounded-xl"
        />
        <div className="min-w-0 pr-5">
          <p className="text-sm font-semibold text-gray-900">
            Install Better Botolan
          </p>
          {iosHint && !installable ? (
            <p className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-gray-600">
              Tap <Share className="inline h-4 w-4" aria-hidden="true" /> then
              &ldquo;Add to Home Screen&rdquo; to use it offline.
            </p>
          ) : (
            <>
              <p className="mt-0.5 text-sm text-gray-600">
                Add it to your home screen — hotlines and preparedness work even
                without signal.
              </p>
              <button
                type="button"
                onClick={install}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Install app
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PwaManager() {
  return (
    <>
      <OfflineBanner />
      <UpdatePrompt />
      <InstallPrompt />
    </>
  );
}
