import Link from "next/link";
import { Login } from "@src/app/_components/Login";
import { auth } from "@auth";
import { config } from "@site.config";
import UserMenu from "@src/app/_components/UserMenu";

export default async function Header() {
  const session = await auth();

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
          {session?.user ? <UserMenu user={session.user} /> : <Login />}
        </div>
      </div>
    </header>
  );
}
