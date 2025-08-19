import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { UserQuizResults } from "../helpers/schema";

export const schema = z.object({
  sessionId: z.string(),
  categoryId: z.number().int().positive(),
  difficulty: z.string(),
  score: z.number().int(),
  totalQuestions: z.number().int().positive(),
  passed: z.boolean(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = Selectable<UserQuizResults>;

export const postQuizResults = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/quiz-results`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
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