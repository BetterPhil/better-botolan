const env = import.meta.env;
export const siteConfig = {
  name: String(env.VITE_GOVERNMENT_NAME || 'Municipality of Botolan'),
  shortName: String(env.VITE_SHORT_NAME || 'Botolan'),
  type: String(env.VITE_GOVERNMENT_TYPE || 'Municipality'),
  province: String(env.VITE_PROVINCE || 'Zambales'),
  region: String(env.VITE_REGION || 'Region III'),
  latitude: 15.2896,
  longitude: 120.0245,
  websiteUrl: String(env.VITE_WEBSITE_URL || ''),
  contactEmail: String(env.VITE_CONTACT_EMAIL || ''),
  contactPhone: String(env.VITE_CONTACT_PHONE || ''),
  repoUrl: 'https://github.com/SilentPing/better-botolan',
  betterGovUrl: 'https://bettergov.ph',
  nationalHotlinesUrl: 'https://bettergov.ph/philippines/hotlines',
} as const;
