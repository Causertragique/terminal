import { db } from "../helpers/db";
import { InputType, OutputType } from "./categories_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const language = url.searchParams.get('language') as InputType['language'];
    
    // Validate language parameter
    const validLanguage = language === 'fr' ? 'fr' : 'en';
    
    const categories = await db
      .selectFrom('categories')
      .select([
        'id',
        'color',
        'createdAt',
        // Use COALESCE to fall back to English if translation is missing
        validLanguage === 'fr' 
          ? db.fn.coalesce('nameFr', 'name').as('name')
          : 'name',
        validLanguage === 'fr'
          ? db.fn.coalesce('descriptionFr', 'description').as('description') 
          : 'description'
      ])
      .orderBy('name', 'asc')
      .execute();

    return new Response(superjson.stringify(categories satisfies OutputType), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}