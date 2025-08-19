import { useQuery } from '@tanstack/react-query';
import { getCommands, type InputType } from '../endpoints/commands_GET.schema';
import { useTranslation } from './useTranslation';
import { normalizeLanguage } from './normalizeLanguage';

export const useCommands = (filters?: Omit<InputType, 'language'> & { language?: 'en' | 'fr' }) => {
  const { i18n } = useTranslation();
  const language = filters?.language || normalizeLanguage(i18n.language);
  
  const filtersWithLanguage = {
    ...filters,
    language,
  };
  
  const queryKey = ['commands', filtersWithLanguage];

  return useQuery({
    queryKey,
    queryFn: () => getCommands(filtersWithLanguage),
  });
};