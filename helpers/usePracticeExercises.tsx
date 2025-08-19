import { useQuery } from '@tanstack/react-query';
import { getPracticeExercises, InputType } from '../endpoints/practice-exercises_GET.schema';
import { useTranslation } from './useTranslation';

// Fonction pour normaliser les codes de langue
const normalizeLanguage = (lng: string): "en" | "fr" => {
  if (lng.startsWith('fr')) return 'fr';
  if (lng.startsWith('en')) return 'en';
  return 'en'; // fallback
};

export const usePracticeExercises = (params: Omit<InputType, 'language'> & { language?: 'en' | 'fr' }) => {
  const { i18n } = useTranslation();
  const language = params.language || normalizeLanguage(i18n.language);
  
  const paramsWithLanguage = {
    ...params,
    language,
  };

  return useQuery({
    queryKey: ['practiceExercises', paramsWithLanguage],
    queryFn: () => getPracticeExercises(paramsWithLanguage),
    enabled: !!params.categoryId, // Only fetch if a category is selected
  });
};