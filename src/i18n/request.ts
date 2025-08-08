import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '../constants/local';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  try {
    // Load messages from public folder
    const messages = await import(`../../public/messages/${locale}.json`);
    return {
      locale,
      messages: messages.default
    };
  } catch (error) {
    // Fallback to default locale if the locale file doesn't exist
    const fallbackMessages = await import(`../../public/messages/${defaultLocale}.json`);
    return {
      locale: defaultLocale,
      messages: fallbackMessages.default
    };
  }
}); 