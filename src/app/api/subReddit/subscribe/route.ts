import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubRedditSubscriptionValidator } from "@/lib/validators/subReddit";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subRedditId } = SubRedditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subRedditId,
        userId: session.user.id,
      },
    });
    if (subscriptionExists) {
      return new Response("You are already subscribed to this subreddit.", {
        status: 400,
      });
    }

    await db.subscription.create({
      data: {
        subRedditId,
        userId: session.user.id,
      },
    });

    return new Response(subRedditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }
    return new Response("Could not subscribe, please try again later.", {
      status: 500,
    });
  }
};
