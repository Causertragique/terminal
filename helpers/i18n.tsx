import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./translations";

// Fonction pour normaliser les codes de langue
export const normalizeLanguage = (lng: string) => {
  if (lng.startsWith('fr')) return 'fr';
  if (lng.startsWith('en')) return 'en';
  return 'en'; // fallback
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false, // Set to true for development debugging
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
    detection: {
      // order and from where user language should be detected
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      // Normaliser les codes de langue
      lookupLocalStorage: "i18nextLng",
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupSessionStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      // Normaliser les codes de langue détectés
      convertDetectedLanguage: (lng: string) => normalizeLanguage(lng),
    },
  });

export default i18n;