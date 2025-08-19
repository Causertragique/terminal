import { db } from "../helpers/db";
import { schema, OutputType } from "./user-session_POST.schema";
import superjson from 'superjson';
import { nanoid } from 'nanoid';

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    if (input.sessionId) {
      const existingSession = await db
        .selectFrom('userSessions')
        .where('sessionId', '=', input.sessionId)
        .select('sessionId')
        .executeTakeFirst();

      if (existingSession) {
        return new Response(superjson.stringify(existingSession satisfies OutputType));
      }
    }

    const newSessionId = nanoid();
    const newSession = await db
      .insertInto('userSessions')
      .values({ sessionId: newSessionId })
      .returning('sessionId')
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify(newSession satisfies OutputType));
  } catch (error) {
    console.error("Failed to create or get user session:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}