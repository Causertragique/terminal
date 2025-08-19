import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postPracticeProgress, InputType } from '../endpoints/practice-progress_POST.schema';

export const usePracticeProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InputType) => postPracticeProgress(data),
    onSuccess: (data) => {
      // Invalidate user progress query to refetch the latest progress
      queryClient.invalidateQueries({ queryKey: ['userProgress', data.sessionId] });
    },
  });
};