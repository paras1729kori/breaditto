import { VoteType } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  subRedditName: string;
  content: string;
  currentVote: VoteType | null;
  createdAt: Date;
};
