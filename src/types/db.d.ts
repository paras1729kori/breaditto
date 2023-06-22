import { Comment, Post, SubReddit, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  subReddit: SubReddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
