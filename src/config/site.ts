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
  facebookUrl: String(env.VITE_FACEBOOK_URL || ''),
  feedbackEndpoint: String(env.VITE_FEEDBACK_ENDPOINT || ''),
  // Web3Forms access key — submissions email to the address tied to the key.
  // Get a free key at https://web3forms.com (no login needed).
  web3formsKey: String(
    env.VITE_WEB3FORMS_ACCESS_KEY || 'd94ef618-cd8a-4559-942c-0cd08e1dd737'
  ),
  repoUrl: 'https://github.com/endebee/better-botolan',
  betterGovUrl: 'https://bettergov.ph',
  nationalHotlinesUrl: 'https://bettergov.ph/philippines/hotlines',
} as const;
