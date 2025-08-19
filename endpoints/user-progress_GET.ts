import { db } from "../helpers/db";
import { schema, OutputType } from "./user-progress_GET.schema";
import superjson from 'superjson';
import { URL } from 'url';

export async function handle(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = {
      sessionId: url.searchParams.get('sessionId'),
    };

    const input = schema.parse(queryParams);

    const practiceProgress = await db
      .selectFrom('userPracticeProgress')
      .selectAll()
      .where('sessionId', '=', input.sessionId)
      .execute();

    const quizResults = await db
      .selectFrom('userQuizResults')
      .selectAll()
      .where('sessionId', '=', input.sessionId)
      .execute();

    const response: OutputType = {
      practiceProgress,
      quizResults,
    };

    return new Response(superjson.stringify(response));
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 400 });
  }
}