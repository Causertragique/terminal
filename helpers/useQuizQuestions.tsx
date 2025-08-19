import { useQuery } from '@tanstack/react-query';
import { getQuizQuestions, InputType } from '../endpoints/quiz-questions_GET.schema';
import { useTranslation } from './useTranslation';

export const useQuizQuestions = (params: Omit<InputType, 'language'> & { language?: 'en' | 'fr' }) => {
  const { i18n } = useTranslation();
  const language = params.language || (i18n.language as 'en' | 'fr');
  
  const paramsWithLanguage = {
    ...params,
    language,
  };

  return useQuery({
    queryKey: ['quizQuestions', paramsWithLanguage],
    queryFn: () => getQuizQuestions(paramsWithLanguage),
    enabled: !!params.categoryId && !!params.difficulty, // Only fetch if category and difficulty are selected
  });
};