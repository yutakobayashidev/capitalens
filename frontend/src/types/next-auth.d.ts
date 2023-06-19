import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's Id. */
      id: string;
      kids: boolean;
      email?: string | null;
      image?: string | null;
      name?: string | null;
      prefecture: number | null;
    };
  }

  interface User {
    id: string;
    kids: boolean;
    name?: string | null;
    email?: string | null;
    email?: string | null;
    image?: string | null;
    prefectureId: number | null;
  }
}
