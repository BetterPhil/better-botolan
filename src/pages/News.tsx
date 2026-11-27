import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Facebook,
  Megaphone,
  Newspaper,
  X,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import { cn } from '../lib/utils';
import { seedAnnouncements, type Announcement } from '../data/announcements';
import FacebookFeed from '../components/news/FacebookFeed';

const dateFmt = new Intl.DateTimeFormat('en-PH', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function fmt(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

function mergeNews(extra: Announcement[]): Announcement[] {
  const byId = new Map<string, Announcement>();
  for (const a of seedAnnouncements) byId.set(a.id, a);
  for (const a of extra) byId.set(a.id, a);
  return [...byId.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function News() {
  const [items, setItems] = useState<Announcement[]>(() => mergeNews([]));
  const [selected, setSelected] = useState<Announcement | null>(null);

  // Pull Facebook-synced posts from the static news.json, if present.
  useEffect(() => {
    let cancelled = false;
    fetch('/news.json', { cache: 'no-cache' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        const valid = data.filter(
          (x): x is Announcement =>
            !!x && typeof x === 'object' && 'id' in x && 'title' in x
        );
        if (valid.length) setItems(mergeNews(valid));
      })
      .catch(() => {
        /* no news.json yet — seed list is already shown */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = items[0];
  const rest = useMemo(() => items.slice(1), [items]);

  return (
    <>
      <SEO
        title="News & Announcements"
        description={`Latest news, advisories, and announcements from ${siteConfig.name}, Zambales.`}
        keywords={`${siteConfig.shortName} news, announcements, advisory, Zambales`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'News' }]}
        />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            kicker="Updates"
            title="News & Announcements"
            description="Advisories, public notices, and updates from the Municipality of Botolan."
          />
          {siteConfig.facebookUrl && (
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
              Follow on Facebook
            </a>
          )}
        </div>

        <div
          className={cn(
            'mt-8 grid gap-8',
            siteConfig.facebookUrl && 'lg:grid-cols-[1.7fr_1fr]'
          )}
        >
          <div>
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                <Newspaper className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No announcements yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured */}
                {featured && (
                  <button
                    type="button"
                    onClick={() => setSelected(featured)}
                    className="group block w-full overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-lg"
                  >
                    <div className="grid md:grid-cols-2">
                      <NewsImage
                        item={featured}
                        className="h-56 w-full md:h-full"
                      />
                      <div className="flex flex-col justify-center p-6 sm:p-8">
                        <NewsMeta item={featured} />
                        <h2 className="mt-2 font-display text-2xl font-bold text-gray-900 group-hover:text-primary-700 sm:text-3xl">
                          {featured.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-gray-600">
                          {featured.summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                          Read more
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </button>
                )}

                {/* Grid */}
                {rest.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item)}
                        className="bb-news-card group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                      >
                        <NewsImage item={item} className="h-40 w-full" />
                        <div className="flex flex-1 flex-col p-5">
                          <NewsMeta item={item} />
                          <h3 className="mt-1.5 font-display text-lg font-semibold text-gray-900 group-hover:text-primary-700">
                            {item.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">
                            {item.summary}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-700">
                            Read more
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {siteConfig.facebookUrl && (
            <aside className="lg:sticky lg:top-24 h-fit">
              <FacebookFeed />
            </aside>
          )}
        </div>
      </Section>

      <NewsModal item={selected} onClose={() => setSelected(null)} />

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-news-card { animation: bb-news-in 0.4s ease-out both; }
          @keyframes bb-news-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </>
  );
}

function NewsMeta({ item }: { item: Announcement }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {item.category && (
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 font-semibold',
            item.source === 'facebook'
              ? 'bg-blue-50 text-blue-700'
              : item.category === 'Example'
                ? 'bg-gray-100 text-gray-500'
                : 'bg-primary-50 text-primary-700'
          )}
        >
          {item.category}
        </span>
      )}
      <span className="flex items-center gap-1 text-gray-400">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        {fmt(item.date)}
      </span>
    </div>
  );
}

function NewsImage({
  item,
  className,
}: {
  item: Announcement;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (item.image && !failed) {
    return (
      <img
        src={item.image}
        alt=""
        className={cn('object-cover', className)}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-primary-500 to-blue-700 text-white/70',
        className
      )}
    >
      <Megaphone className="h-10 w-10" aria-hidden="true" />
    </div>
  );
}

function NewsModal({
  item,
  onClose,
}: {
  item: Announcement | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="bb-news-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
      />
      <div className="bb-news-panel relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative shrink-0">
          <NewsImage item={item} className="h-52 w-full sm:h-64" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <NewsMeta item={item} />
          <h2 className="mt-2 font-display text-2xl font-bold text-gray-900">
            {item.title}
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">
            {item.body || item.summary}
          </p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              {item.source === 'facebook' ? (
                <Facebook className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              )}
              View original post
            </a>
          )}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-news-overlay { animation: bb-nmo-fade 0.15s ease-out; }
          .bb-news-panel { animation: bb-nmo-pop 0.22s cubic-bezier(.2,.8,.2,1); }
          @keyframes bb-nmo-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bb-nmo-pop {
            from { opacity: 0; transform: translateY(14px) scale(0.97); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </div>
  );
}
