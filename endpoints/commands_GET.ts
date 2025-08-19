import { db } from "../helpers/db";
import { schema, OutputType } from "./commands_GET.schema";
import superjson from 'superjson';
import { sql } from 'kysely';

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Manually handle tags array from query params
    const tags = url.searchParams.get('tags');
    const validatedInput = schema.parse({
      ...queryParams,
      tags: tags ? tags.split(',') : undefined,
    });

    const { categoryId, search, tags: searchTags, language } = validatedInput;

    let query = db
      .selectFrom('commands')
      .innerJoin('categories', 'categories.id', 'commands.categoryId')
      .select([
        'commands.id',
        'commands.command',
        language === 'fr' 
          ? sql<string>`COALESCE(commands.description_fr, commands.description)`.as('description')
          : 'commands.description',
        'commands.syntax',
        language === 'fr'
          ? sql<string>`COALESCE(commands.example_fr, commands.example)`.as('example')
          : 'commands.example',
        'commands.tags',
        'commands.context',
        'commands.commonErrors',
        'commands.solutions',
        'commands.createdAt',
        'categories.id as categoryId',
        language === 'fr'
          ? sql<string>`COALESCE(categories.name_fr, categories.name)`.as('categoryName')
          : 'categories.name as categoryName',
        'categories.color as categoryColor',
      ]);

    if (categoryId) {
      query = query.where('commands.categoryId', '=', categoryId);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where((eb) =>
        eb.or([
          eb('commands.command', 'ilike', searchTerm),
          eb('commands.description', 'ilike', searchTerm),
          eb('commands.syntax', 'ilike', searchTerm),
        ])
      );
    }

    if (searchTags && searchTags.length > 0) {
      // The `tags` column is of type `text[]`. We use the @> (contains) operator.
      // Kysely doesn't have a built-in function for this, so we use raw SQL.
      query = query.where(sql`commands.tags @> ${sql.array(searchTags)}`);
    }

    const commands = await query.orderBy('commands.command', 'asc').execute();

    return new Response(superjson.stringify(commands satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching commands:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}