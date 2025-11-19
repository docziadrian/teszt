import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import hu from '../locales/hu.json';
import en from '../locales/en.json';
import de from '../locales/de.json';

export const resources = {
  hu: { translation: hu },
  en: { translation: en },
  de: { translation: de },
} as const;

// Function to initialize i18n (useful for server side too)
export const initI18n = () => {
  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'hu',
        debug: false,
        interpolation: {
          escapeValue: false,
        },
        // Use LanguageDetector only on client side
        ...(typeof window !== 'undefined' 
          ? { 
              detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
              }, 
            } 
          : {}),
      });
      
      if (typeof window !== 'undefined') {
         i18n.use(LanguageDetector);
      }
  }
  return i18n;
};

initI18n();

export default i18n;

