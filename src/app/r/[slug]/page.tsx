import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subReddit = await db.subReddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subReddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },

        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });
  if (!subReddit) return notFound();

  return (
    <>
      <h1 className="text-3xl md:text-4xl h-14">
        r/<span className="font-bold">{subReddit.name}</span>
      </h1>
      <MiniCreatePost session={session} />

      {/* TODO: Show posts in your feed with infinite scrolling */}
      <PostFeed initialPosts={subReddit.posts} subRedditName={subReddit.name} />
    </>
  );
};

export default page;
