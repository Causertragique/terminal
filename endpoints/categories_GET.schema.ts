import { z } from "zod";
import superjson from 'superjson';

// Input schema for language parameter
export const InputSchema = z.object({
  language: z.enum(['en', 'fr']).optional()
});

export type InputType = z.infer<typeof InputSchema>;

// Output type for categories with selected language fields
export type OutputType = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date | null;
}[];

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
    const errorObject = superjson.parse(await result.text());
    throw new Error(errorObject.error || 'Failed to fetch categories');
  }
  return superjson.parse<OutputType>(await result.text());
};