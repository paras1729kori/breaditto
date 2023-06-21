import { z } from "zod";

export const SubRedditValidator = z.object({
  name: z.string().min(3).max(21),
});

export const SubRedditSubscriptionValidator = z.object({
  subRedditId: z.string(),
});

export type CreateSubRedditPayload = z.infer<typeof SubRedditValidator>;
export type CreateSubRedditSubscriptionPayload = z.infer<
  typeof SubRedditSubscriptionValidator
>;
