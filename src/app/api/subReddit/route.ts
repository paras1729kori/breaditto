// This is a standard of dealing with backend apis
// Best practice for creating apis

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubRedditValidator } from "@/lib/validators/subReddit";
import { z } from "zod";

// Best practice logic
export async function POST(req: Request) {
  try {
    // getAuthSession used to get the current session details
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = SubRedditValidator.parse(body);

    // if subreddit already exists
    const subRedditExists = await db.subReddit.findFirst({
      where: {
        name,
      },
    });
    if (subRedditExists) {
      return new Response("Subreddit already exists", { status: 405 });
    }
    const subReddit = await db.subReddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // subscribing the creator of the subreddit to the created subreddit
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subRedditId: subReddit.id,
      },
    });

    return new Response(subReddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not create subreddit", { status: 500 });
  }
}
