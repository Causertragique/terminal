import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Categories } from '../helpers/schema';

// Input schema for language parameter
export const InputSchema = z.object({
  language: z.enum(['en', 'fr']).optional()
});

export type InputType = z.infer<typeof InputSchema>;

// Output type for categories with complete structure
export type OutputType = Selectable<Categories>[];

export const getCategories = async (params?: { language?: 'en' | 'fr' }, init?: RequestInit): Promise<OutputType> => {
  const queryParams = new URLSearchParams();
  if (params?.language) {
    queryParams.set('language', params.language);
  }
  
  const url = `/_api/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const result = await fetch(url, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as { error?: string };
    throw new Error(errorObject.error || 'Failed to fetch categories');
  }
  return superjson.parse<OutputType>(await result.text());
};