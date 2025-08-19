import { db } from "../helpers/db";
import { schema, OutputType } from "./quiz-results_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const result = await db
      .insertInto('userQuizResults')
      .values({
        ...input,
        completedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify(result satisfies OutputType));
  } catch (error) {
    console.error("Failed to submit quiz results:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}