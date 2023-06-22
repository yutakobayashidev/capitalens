import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@src/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      kids: boolean;
      prefectureId: null | number;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  secret: process.env.SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma),
});
