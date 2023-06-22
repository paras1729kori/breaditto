import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
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
        },

        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subReddit: {
            name: slug,
          },
          user: {
            id: session?.user.id,
          },
        },
      });
  const isSubscribed = !!subscription;

  if (!subReddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subReddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div className="">
        {/* TODO: Button take us back */}

        {/* layout for feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/* info sidebar' */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-100 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{slug}</p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subReddit.createdAt.toDateString()}>
                    {/* function called for formatting. Need to install date-fns dependency */}
                    {format(subReddit.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gapy-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>

              {subReddit.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You created this community</p>
                </div>
              ) : null}

              {subReddit.creatorId !== session?.user.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subRedditId={subReddit.id}
                  subRedditName={subReddit.name}
                />
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
