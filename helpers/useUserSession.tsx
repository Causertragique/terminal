import { useMutation } from '@tanstack/react-query';
import { postUserSession, InputType } from '../endpoints/user-session_POST.schema';

export const useUserSession = () => {
  return useMutation({
    mutationFn: (data: InputType) => postUserSession(data),
  });
};