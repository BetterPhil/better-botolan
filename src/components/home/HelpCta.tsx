import { Link } from 'react-router';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { emergencyHotlines } from '../../data/hotlines';
import { siteConfig } from '../../config/site';

export default function HelpCta() {
  const hotlines = emergencyHotlines.filter(h => h.number.trim() !== '');

  return (
    <section
      aria-labelledby="help-heading"
      className="bg-gradient-to-r from-primary-800 to-primary-600 text-white"
    >
      <div className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="help-heading" className="text-2xl font-bold md:text-4xl">
            Can&apos;t find what you need?
          </h2>
          <p className="mt-3 max-w-xl text-primary-100">
            Browse services and government offices, or contact the Municipal
            Government of {siteConfig.shortName} directly for official records
            and transactions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-50"
            >
              Browse services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/government/departments"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Government offices
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-100">
            Reach out
          </h3>
          <ul className="space-y-3 text-sm">
            {hotlines.map(({ label, number, icon: Icon }) => (
              <li key={label}>
                <a
                  href={`tel:${number.replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">{label}</span>
                  <span className="font-mono">{number}</span>
                </a>
              </li>
            ))}
            {siteConfig.contactPhone && (
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.contactPhone.replace(/[^\d+]/g, '')}`}
                  className="hover:underline"
                >
                  {siteConfig.contactPhone}
                </a>
              </li>
            )}
            {siteConfig.contactEmail && (
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
