import { useQuery } from '@tanstack/react-query';
import { getUserProgress, InputType } from '../endpoints/user-progress_GET.schema';

export const useUserProgress = (params: InputType) => {
  return useQuery({
    queryKey: ['userProgress', params.sessionId],
    queryFn: () => getUserProgress(params),
    enabled: !!params.sessionId, // Only fetch if a session ID is available
  });
};