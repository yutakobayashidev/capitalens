import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's Id. */
      id: string;
      email?: string | null;
      image?: string | null;
      name?: string | null;
    };
  }
}
