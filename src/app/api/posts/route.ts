import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subReddit: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(
      ({ subReddit }) => subReddit.id
    );
  }

  try {
    const { limit, page, subRedditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subRedditName: z.string().nullish().optional(),
      })
      .parse({
        subRedditName: url.searchParams.get("subRedditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (subRedditName) {
      whereClause = {
        subReddit: {
          name: subRedditName,
        },
      };
    } else if (session) {
      whereClause = {
        subReddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      // giving the post which are not on the page
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subReddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }
    return new Response("Could not fetch more posts.", {
      status: 500,
    });
  }
}
