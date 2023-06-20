import NextAuth, { DefaultSession } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    // extending id and username to Session.user types and adding the DefaultSession props as extending the
    // types overwrites the DefaultSession props
    user: {
      id: UserId;
      username?: string | null;
    } & DefaultSession["user"];
  }
}
