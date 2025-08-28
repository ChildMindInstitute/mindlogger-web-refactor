import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import elResources from '~/i18n/el/translation.json';
import enResources from '~/i18n/en/translation.json';
import esResources from '~/i18n/es/translation.json';
import frResources from '~/i18n/fr/translation.json';
import ptResources from '~/i18n/pt/translation.json';

const i18nManager = {
  async initialize() {
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        resources: {
          en: enResources,
          fr: frResources,
          el: elResources,
          es: esResources,
          pt: ptResources,
        },
        supportedLngs: ['en', 'fr', 'el', 'es', 'pt'],
        interpolation: {
          escapeValue: false,
        },
        debug: import.meta.env.NODE_ENV !== 'production',
      });
  },

  addResources(language: string, namespace: string, resources: Record<string, string>) {
    i18n.addResources(language, namespace, resources);
  },
};

export default i18nManager;
