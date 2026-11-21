import { Link } from 'react-router';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../../config/site';
import { serviceCategories } from '../../data/yamlLoader';

const linkClass = 'text-sm text-gray-300 hover:text-white transition-colors';

export default function Footer() {
  const { t } = useTranslation('common');
  const topics = serviceCategories.categories.slice(0, 6);

  return (
    <footer className="bg-primary-900 text-white">
      <div className="h-1 bg-primary-600" aria-hidden="true" />

      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/logo-mark.svg"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div className="leading-tight">
                <div className="text-xs text-primary-200">Better</div>
                <div className="text-xl font-bold">{siteConfig.shortName}</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              A community-run portal that makes public information for the{' '}
              {siteConfig.name}, {siteConfig.province}, easier to find and use.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              {topics.map(topic => (
                <li key={topic.slug}>
                  <Link to={`/services/${topic.slug}`} className={linkClass}>
                    {topic.category}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className={`${linkClass} font-semibold`}>
                  All services
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/government/departments" className={linkClass}>
                  Government
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About this portal
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.nationalHotlinesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  National hotlines
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.betterGovUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  BetterGov Philippines
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${linkClass} inline-flex items-center gap-1`}
                >
                  Contribute on GitHub
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact (only shows what you set in .env.local) */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {siteConfig.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="hover:text-white"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </li>
              )}
              {siteConfig.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <a
                    href={`tel:${siteConfig.contactPhone.replace(/[^\d+]/g, '')}`}
                    className="hover:text-white"
                  >
                    {siteConfig.contactPhone}
                  </a>
                </li>
              )}
              <li>
                For official records and transactions, please contact the
                Municipal Government of {siteConfig.shortName} directly.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
