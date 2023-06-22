import { z } from "zod";

export const PostValidator = z.object({
  subRedditId: z.string(),
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(21, { message: "Title cannot be longer than 128 characters." }),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
