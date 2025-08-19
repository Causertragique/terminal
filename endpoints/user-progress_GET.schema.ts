import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { UserPracticeProgress, UserQuizResults } from "../helpers/schema";

export const schema = z.object({
  sessionId: z.string(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  practiceProgress: Selectable<UserPracticeProgress>[];
  quizResults: Selectable<UserQuizResults>[];
};

export const getUserProgress = async (params: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedParams = schema.parse(params);
  const searchParams = new URLSearchParams({ sessionId: validatedParams.sessionId });

  const result = await fetch(`/_api/user-progress?${searchParams.toString()}`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};