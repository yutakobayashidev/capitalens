import Link from "next/link";
import { Login } from "@src/app/bill/[id]/actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@src/app/api/auth/[...nextauth]/authOptions";
import { config } from "@site.config";
import { ProfileDropdown } from "./_action";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-white border-b border-gray-200 flex h-16 relative items-center">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8 flex">
        <Link
          href="/"
          className="font-bold font-base text-2xl flex items-center"
        >
          {config.siteMeta.title}
        </Link>
        <div className="flex items-center gap-x-4 ml-auto">
          {session &&
          session.user &&
          session.user.image &&
          session.user.name ? (
            <ProfileDropdown session={session} />
          ) : (
            <Login />
          )}
        </div>
      </div>
    </header>
  );
}
