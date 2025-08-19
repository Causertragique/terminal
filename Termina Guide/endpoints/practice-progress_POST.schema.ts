import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { UserPracticeProgress } from "../helpers/schema";

export const schema = z.object({
  sessionId: z.string(),
  exerciseId: z.number().int().positive(),
  completed: z.boolean(),
  attempts: z.number().int().positive(),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = Selectable<UserPracticeProgress>;

export const postPracticeProgress = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/practice-progress`, {
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