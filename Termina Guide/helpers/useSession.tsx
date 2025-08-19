import { useState, useEffect } from 'react';
import { useUserSession } from '../helpers/useUserSession';

const SESSION_ID_KEY = 'terminal_practice_session_id';

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SESSION_ID_KEY);
    }
    return null;
  });

  const { mutate: createSession, isPending } = useUserSession();

  useEffect(() => {
    if (!sessionId && !isPending) {
      console.log('No session ID found, creating a new one.');
      createSession(
        {},
        {
          onSuccess: data => {
            localStorage.setItem(SESSION_ID_KEY, data.sessionId);
            setSessionId(data.sessionId);
            console.log('New session created:', data.sessionId);
          },
          onError: error => {
            console.error('Failed to create user session:', error);
          },
        },
      );
    }
  }, [sessionId, createSession, isPending]);

  return { sessionId, isLoading: isPending };
};