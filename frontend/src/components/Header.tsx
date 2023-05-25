import Link from "next/link";
import { Login } from "@src/app/bill/[id]/actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@src/app/api/auth/[...nextauth]/authOptions";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-bold font-base text-2xl md:text-3xl flex items-center"
          >
            CapitaLens
            <span className="text-sm ml-3 text-gray-400 border py-0.5 px-1 font-medium rounded-md">
              BETA
            </span>
          </Link>
          <div className="flex items-center gap-x-4">
            <Link href="/about" className="font-bold text-base md:text-lg">
              About
            </Link>
            {session &&
            session.user &&
            session.user.image &&
            session.user.name ? (
              <img
                src={session.user.image}
                className="rounded-full w-10 h-10"
                alt={session.user.name}
              />
            ) : (
              <Login />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
