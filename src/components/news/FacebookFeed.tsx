import { Facebook } from 'lucide-react';
import { siteConfig } from '../../config/site';

/**
 * Live Facebook timeline via the official Page Plugin (iframe).
 * Needs only the PUBLIC page URL (VITE_FACEBOOK_URL) — no access token and no
 * Page-admin rights. Renders nothing if the URL isn't configured.
 */
export default function FacebookFeed({ height = 720 }: { height?: number }) {
  const url = siteConfig.facebookUrl;
  if (!url) return null;

  const src =
    'https://www.facebook.com/plugins/page.php?href=' +
    encodeURIComponent(url) +
    `&tabs=timeline&width=500&height=${height}` +
    '&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-blue-50 px-4 py-3">
        <Facebook className="h-4 w-4 text-blue-600" aria-hidden="true" />
        <span className="text-sm font-semibold text-gray-800">
          Latest from Facebook
        </span>
      </div>
      <div className="flex justify-center p-2">
        <iframe
          title={`${siteConfig.shortName} Facebook timeline`}
          src={src}
          loading="lazy"
          style={{
            border: 'none',
            overflow: 'hidden',
            width: '100%',
            maxWidth: 500,
            height,
          }}
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="block border-t border-gray-100 px-4 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-50"
      >
        Open the full page on Facebook
      </a>
    </div>
  );
}
