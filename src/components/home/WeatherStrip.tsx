import { CloudRain, Droplets, ExternalLink, Wind } from 'lucide-react';
import { useWeather, weatherLabel } from '../../hooks/useWeather';
import { siteConfig } from '../../config/site';

/**
 * A small live weather band for the homepage. Botolan is coastal and sits
 * near Mount Pinatubo, so it links to PAGASA and PHIVOLCS for official
 * warnings. If the weather API fails, it still shows the official links.
 */
export default function WeatherStrip() {
  const { data, error } = useWeather();

  return (
    <section aria-labelledby="weather-heading" className="bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-primary-50 to-white p-5 shadow-[var(--bb-shadow-card)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {data ? (
              <>
                <div className="font-display text-4xl font-semibold text-gray-900">
                  {data.temperature}°C
                </div>
                <div>
                  <div
                    id="weather-heading"
                    className="font-semibold text-gray-900"
                  >
                    {weatherLabel(data.code)} in {siteConfig.shortName}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
                      {data.humidity}% humidity
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5" aria-hidden="true" />
                      {data.windSpeed} km/h
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CloudRain className="h-3.5 w-3.5" aria-hidden="true" />
                      {data.precipProbMax}% rain today
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div id="weather-heading" className="font-semibold text-gray-900">
                {error
                  ? 'Weather is unavailable right now'
                  : `Loading ${siteConfig.shortName} weather…`}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.pagasa.dost.gov.ph"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              PAGASA warnings
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://www.phivolcs.dost.gov.ph"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              PHIVOLCS (Pinatubo)
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
        {data && (
          <p className="mt-2 text-center text-xs text-gray-400">
            Live conditions from Open-Meteo. For official storm and volcano
            warnings, always follow PAGASA and PHIVOLCS.
          </p>
        )}
      </div>
    </section>
  );
}
