export type SupportedLanguage = "en" | "fr";

/**
 * Normalizes a locale string (e.g., 'en-US', 'fr-FR') to a supported language code ('en' | 'fr').
 * This ensures compatibility between i18next language codes and the API schema.
 *
 * @param locale The locale string to normalize. Can be null or undefined.
 * @returns A normalized language code ('en' | 'fr'), defaulting to 'en'.
 */
export const normalizeLanguage = (
  locale?: string | null,
): SupportedLanguage => {
  if (!locale) {
    return "en";
  }

  const lang = locale.substring(0, 2).toLowerCase();

  if (lang === "fr") {
    return "fr";
  }

  return "en";
};