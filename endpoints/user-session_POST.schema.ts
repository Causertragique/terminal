import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  sessionId: z.string().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  sessionId: string;
};

export const postUserSession = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/user-session`, {
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