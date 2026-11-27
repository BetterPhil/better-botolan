import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import {
  INSTALL_CHANGE_EVENT,
  IOS_HINT_EVENT,
  canInstall,
  isIos,
  isStandalone,
  promptInstall,
} from '../../pwa/install';

/**
 * A discoverable "Install app" entry for the footer. Shows only when the app
 * can actually be installed (Chromium gave us a deferred prompt) or on iOS
 * (where install is manual) — and never once the app is already installed.
 */
export default function InstallButton({ className }: { className?: string }) {
  const [installable, setInstallable] = useState(() => canInstall());
  const [standalone, setStandalone] = useState(() => isStandalone());

  useEffect(() => {
    const onChange = () => {
      setInstallable(canInstall());
      setStandalone(isStandalone());
    };
    window.addEventListener(INSTALL_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(INSTALL_CHANGE_EVENT, onChange);
  }, []);

  if (standalone) return null;
  const ios = isIos();
  if (!installable && !ios) return null;

  const handle = () => {
    if (installable) {
      void promptInstall();
    } else {
      // iOS: ask the PwaManager to surface the Add-to-Home-Screen hint.
      window.dispatchEvent(new CustomEvent(IOS_HINT_EVENT));
    }
  };

  return (
    <button type="button" onClick={handle} className={className}>
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      Install app
    </button>
  );
}
