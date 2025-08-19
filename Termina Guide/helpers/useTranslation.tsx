import { useTranslation as useOriginalTranslation } from "react-i18next";

/**
 * A hook to provide the `t` function for translations and the `i18n` instance.
 * This is a re-export of the original `useTranslation` hook from `react-i18next`.
 */
export const useTranslation = useOriginalTranslation;

/**
 * A dedicated hook for managing language state.
 * @returns An object with the current language and a function to change it.
 */
export const useLanguage = () => {
  const { i18n } = useOriginalTranslation();

  const changeLanguage = (lang: "en" | "fr") => {
    i18n.changeLanguage(lang);
  };

  return {
    language: i18n.language as "en" | "fr",
    changeLanguage,
  };
};