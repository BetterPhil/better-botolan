import { useEffect, useRef, useState } from 'react';
import {
  BOTOLAN_CENTER,
  BOTOLAN_ZOOM,
  categoryMeta,
  mapPoints,
  type PointCategory,
} from '../../data/mapPoints';

const LEAFLET_CSS =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
const LEAFLET_JS =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

// Minimal typings for the bits of Leaflet we use (loaded from CDN at runtime).
interface LeafletMap {
  setView(center: [number, number], zoom: number): LeafletMap;
  remove(): void;
}
interface LeafletStatic {
  map(el: HTMLElement, opts?: Record<string, unknown>): LeafletMap;
  tileLayer(
    url: string,
    opts?: Record<string, unknown>
  ): { addTo(m: LeafletMap): void };
  marker(
    latlng: [number, number],
    opts?: Record<string, unknown>
  ): { addTo(m: LeafletMap): { bindPopup(html: string): void } };
  divIcon(opts: Record<string, unknown>): unknown;
}
declare global {
  interface Window {
    L?: LeafletStatic;
  }
}

function loadLeaflet(): Promise<LeafletStatic> {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L!));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () =>
      window.L ? resolve(window.L) : reject(new Error('Leaflet failed'));
    script.onerror = () => reject(new Error('Leaflet failed to load'));
    document.body.appendChild(script);
  });
}

function pinIcon(L: LeafletStatic, color: string) {
  return L.divIcon({
    className: '',
    html: `<span style="display:inline-block;width:18px;height:18px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
  });
}

export default function BotolanMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then(L => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
        }).setView(BOTOLAN_CENTER, BOTOLAN_ZOOM);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        mapPoints.forEach(p => {
          const color = categoryMeta[p.category].color;
          const marker = L.marker([p.lat, p.lng], {
            icon: pinIcon(L, color),
          }).addTo(map);
          marker.bindPopup(
            `<strong>${p.name}</strong>${
              p.description ? `<br/><span>${p.description}</span>` : ''
            }`
          );
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const categories = Array.from(
    new Set(mapPoints.map(p => p.category))
  ) as PointCategory[];

  if (error) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
        The map couldn&apos;t load. Please check your connection and try again.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-2xl border border-gray-200 shadow-[var(--bb-shadow-card)]"
        style={{ background: '#e9ecef' }}
      />
      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {categories.map(c => (
            <span
              key={c}
              className="flex items-center gap-1.5 text-xs text-gray-600"
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: categoryMeta[c].color }}
              />
              {categoryMeta[c].label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
