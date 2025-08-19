import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../endpoints/categories_GET.schema';
import { useTranslation } from './useTranslation';
import { normalizeLanguage } from './normalizeLanguage';

export const useCategories = (language?: 'en' | 'fr') => {
  const { i18n } = useTranslation();
  const currentLanguage = language || normalizeLanguage(i18n.language);

  return useQuery({
    queryKey: ['categories', currentLanguage],
    queryFn: () => getCategories({ language: currentLanguage }),
  });
};