import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postQuizResults, InputType } from '../endpoints/quiz-results_POST.schema';

export const useQuizResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InputType) => postQuizResults(data),
    onSuccess: (data) => {
      // Invalidate user progress query to refetch the latest progress
      queryClient.invalidateQueries({ queryKey: ['userProgress', data.sessionId] });
    },
  });
};