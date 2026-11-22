import { Phone, TriangleAlert } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import { botolanHotlines, telHref } from '../data/hotlines';

export default function Hotlines() {
  return (
    <>
      <SEO
        title="Emergency Hotlines"
        description={`Official emergency hotlines for ${siteConfig.name}, Zambales: police, fire, MDRRMO, health and hospital.`}
        keywords={`${siteConfig.shortName} hotlines, emergency, MDRRMO, police, fire, 911`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Hotlines' }]}
        />

        <SectionHeading
          kicker="Emergency"
          title={`${siteConfig.shortName} Emergency Hotlines`}
          description="Save these numbers now. In a life-threatening emergency, call 911 — one number for police, fire and medical response."
        />

        <a
          href={telHref('911')}
          className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-700 to-primary-900 p-6 text-white shadow-[var(--bb-shadow-lift)] transition hover:brightness-110"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
              <TriangleAlert className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm uppercase tracking-widest text-primary-100">
                Unified Emergency Number
              </div>
              <div className="font-display text-4xl font-semibold">911</div>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-primary-800 sm:inline-flex">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call now
          </span>
        </a>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {botolanHotlines
            .filter(office => office.label !== 'Unified Emergency')
            .map(office => {
              const Icon = office.icon;
              return (
                <div
                  key={office.label}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold leading-tight text-gray-900">
                      {office.label}
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {office.numbers.map(num => (
                      <li key={num}>
                        <a
                          href={telHref(num)}
                          className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 font-mono text-lg font-semibold text-gray-900 transition hover:bg-primary-50 hover:text-primary-700"
                        >
                          <Phone
                            className="h-4 w-4 text-primary-600"
                            aria-hidden="true"
                          />
                          {num}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {office.note && (
                    <p className="mt-3 text-sm text-gray-500">{office.note}</p>
                  )}
                </div>
              );
            })}
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Source: official Botolan Emergency Hotlines advisory. Tap any number
          to call. If a number has changed, please let us know so we can update
          it.
        </p>
      </Section>
    </>
  );
}
