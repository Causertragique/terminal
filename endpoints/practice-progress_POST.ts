import { db } from "../helpers/db";
import { schema, OutputType } from "./practice-progress_POST.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const { sessionId, exerciseId, completed, attempts } = input;

    const result = await db
      .insertInto('userPracticeProgress')
      .values({
        sessionId,
        exerciseId,
        completed,
        attempts,
        completedAt: completed ? new Date() : null,
      })
      .onConflict((oc) => oc
        .columns(['sessionId', 'exerciseId'])
        .doUpdateSet({
          completed,
          attempts,
          completedAt: completed ? new Date() : null,
        })
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify(result satisfies OutputType));
  } catch (error) {
    console.error("Failed to update practice progress:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}