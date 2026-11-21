const env = import.meta.env;

export const siteConfig = {
  name: String(env.VITE_GOVERNMENT_NAME || 'Municipality of Botolan'),
  shortName: String(env.VITE_SHORT_NAME || 'Botolan'),
  type: String(env.VITE_GOVERNMENT_TYPE || 'Municipality'),
  province: String(env.VITE_PROVINCE || 'Zambales'),
  region: String(env.VITE_REGION || 'Region III'),
  websiteUrl: String(env.VITE_WEBSITE_URL || ''),
  betterGovUrl: 'https://bettergov.ph',
  nationalHotlinesUrl: 'https://bettergov.ph/philippines/hotlines',
} as const;
