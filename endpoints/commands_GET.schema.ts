import { z } from "zod";
import superjson from 'superjson';
import type { Selectable } from 'kysely';
import type { Commands, Categories } from '../helpers/schema';

export const schema = z.object({
  categoryId: z.coerce.number().int().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.enum(['en', 'fr']).optional(),
});

export type InputType = z.infer<typeof schema>;

export type CommandWithCategory = Pick<
  Selectable<Commands>,
  'id' | 'command' | 'description' | 'syntax' | 'example' | 'tags' | 'context' | 'commonErrors' | 'solutions' | 'createdAt'
> & {
  categoryId: Selectable<Categories>['id'];
  categoryName: Selectable<Categories>['name'];
  categoryColor: Selectable<Categories>['color'];
};

export type OutputType = CommandWithCategory[];

export const getCommands = async (params?: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedParams = params ? schema.parse(params) : {};
  
  const searchParams = new URLSearchParams();
  if (validatedParams.categoryId) {
    searchParams.set('categoryId', validatedParams.categoryId.toString());
  }
  if (validatedParams.search) {
    searchParams.set('search', validatedParams.search);
  }
  if (validatedParams.tags && validatedParams.tags.length > 0) {
    searchParams.set('tags', validatedParams.tags.join(','));
  }
  if (validatedParams.language) {
    searchParams.set('language', validatedParams.language);
  }

  const queryString = searchParams.toString();
  const url = `/_api/commands${queryString ? `?${queryString}` : ''}`;

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
    throw new Error(errorObject.error || 'Failed to fetch commands');
  }
  return superjson.parse<OutputType>(await result.text());
};