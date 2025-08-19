import { db } from "../helpers/db";
import { schema, OutputType } from "./quiz-questions_GET.schema";
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
    const language = input.language || 'en';

    let query = db.selectFrom('quizQuestions').select([
      'id',
      'categoryId',
      'difficulty',
      'questionType',
      'correctAnswer',
      'wrongAnswers',
      'points',
      'createdAt',
      // Use COALESCE to select appropriate language fields with English fallback
      db.fn.coalesce(
        language === 'fr' ? 'questionFr' : 'question',
        'question'
      ).as('question'),
      db.fn.coalesce(
        language === 'fr' ? 'explanationFr' : 'explanation',
        'explanation'
      ).as('explanation')
    ]);

    if (input.categoryId) {
      query = query.where('categoryId', '=', input.categoryId);
    }

    if (input.difficulty) {
      query = query.where('difficulty', '=', input.difficulty);
    }

    const questions = await query.execute();

    return new Response(superjson.stringify(questions satisfies OutputType));
  } catch (error) {
    console.error("Failed to fetch quiz questions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}