import { db } from "../helpers/db";
import { schema, OutputType } from "./practice-exercises_GET.schema";
import superjson from 'superjson';
import { URL } from 'url';

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      categoryId: url.searchParams.get('categoryId'),
      difficulty: url.searchParams.get('difficulty'),
      language: url.searchParams.get('language'),
    };

    const input = schema.parse(queryParams);

    let query = db.selectFrom('practiceExercises')
      .select([
        'id',
        'categoryId',
        'difficulty',
        'commandToExecute',
        'hints',
        'learningPoints',
        'createdAt',
        // Use COALESCE to fallback to English if French translation is missing or if language is 'en'
        (eb) => eb.fn.coalesce(
          input.language === 'fr' ? 'titleFr' : 'title',
          'title'
        ).as('title'),
        (eb) => eb.fn.coalesce(
          input.language === 'fr' ? 'descriptionFr' : 'description',
          'description'
        ).as('description'),
        (eb) => eb.fn.coalesce(
          input.language === 'fr' ? 'expectedOutputFr' : 'expectedOutput',
          'expectedOutput'
        ).as('expectedOutput')
      ]);

    if (input.categoryId) {
      query = query.where('categoryId', '=', input.categoryId);
    }

    if (input.difficulty) {
      query = query.where('difficulty', '=', input.difficulty);
    }

    const exercises = await query.execute();

    return new Response(superjson.stringify(exercises satisfies OutputType));
  } catch (error) {
    console.error("Failed to fetch practice exercises:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}