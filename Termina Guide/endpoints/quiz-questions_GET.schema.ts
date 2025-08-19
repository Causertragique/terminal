import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { QuizQuestions } from "../helpers/schema";

export const schema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  difficulty: z.string().optional(),
  language: z.enum(['en', 'fr']).optional(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = Selectable<QuizQuestions>[];

export const getQuizQuestions = async (params: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedParams = schema.parse(params);
  const searchParams = new URLSearchParams();
  
  if (validatedParams.categoryId) {
    searchParams.append('categoryId', validatedParams.categoryId.toString());
  }
  if (validatedParams.difficulty) {
    searchParams.append('difficulty', validatedParams.difficulty);
  }
  if (validatedParams.language) {
    searchParams.append('language', validatedParams.language);
  }

  const result = await fetch(`/_api/quiz-questions?${searchParams.toString()}`, {
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