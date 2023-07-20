import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@src/lib/prisma";
import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      createdAt: string;
      kids: boolean;
      prefectureId: null | number;
      updatedAt: string;
    } & DefaultSession["user"];
  }
}

export const {
  auth,
  CSRF_experimental,
  handlers: { GET, POST },
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  secret: process.env.SECRET,
});
