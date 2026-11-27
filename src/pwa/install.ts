/**
 * Install (A2HS) helpers shared by the install card and the footer button.
 *
 * The browser's `beforeinstallprompt` event can fire *before* React mounts,
 * so it is captured early by an inline script in index.html, stashed on
 * `window.__bbDeferredPrompt`, and announced with a `bb:installchange` event.
 * Everything here reads that single stash so the whole app agrees on whether
 * the app can be installed right now.
 */

export const INSTALL_CHANGE_EVENT = 'bb:installchange';
/** Fired by the footer/card to ask the manager to show the iOS hint. */
export const IOS_HINT_EVENT = 'bb:show-ios-hint';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    __bbDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // iPadOS 13+ reports as Mac; detect by touch points.
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  );
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === 'undefined') return null;
  return window.__bbDeferredPrompt ?? null;
}

export function canInstall(): boolean {
  return Boolean(getDeferredPrompt());
}

/** Fire the native install prompt. Returns the user's choice (or status). */
export async function promptInstall(): Promise<
  'accepted' | 'dismissed' | 'unavailable'
> {
  const event = getDeferredPrompt();
  if (!event) return 'unavailable';
  await event.prompt();
  const choice = await event.userChoice.catch(() => ({
    outcome: 'dismissed' as const,
  }));
  // A deferred prompt can only be used once.
  window.__bbDeferredPrompt = null;
  window.dispatchEvent(new CustomEvent(INSTALL_CHANGE_EVENT));
  return choice.outcome;
}
