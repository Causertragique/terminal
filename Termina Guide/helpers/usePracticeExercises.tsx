import { useQuery } from '@tanstack/react-query';
import { getPracticeExercises, InputType } from '../endpoints/practice-exercises_GET.schema';
import { useTranslation } from './useTranslation';

export const usePracticeExercises = (params: Omit<InputType, 'language'> & { language?: 'en' | 'fr' }) => {
  const { i18n } = useTranslation();
  const language = params.language || (i18n.language as 'en' | 'fr');
  
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