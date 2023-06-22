import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subRedditId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subRedditId,
        userId: session.user.id,
      },
    });
    if (!subscriptionExists) {
      return new Response("Subscribe to post.", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        subRedditId,
        title,
        content,
        authorId: session?.user.id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }
    return new Response("Could not post to subreddit at this time.", {
      status: 500,
    });
  }
};
