import { auth } from "@auth";
import { config } from "@site.config";
import { Login } from "@src/app/_components/Login";
import UserMenu from "@src/app/_components/UserMenu";
import { SearchIcon } from "@xpadev-net/designsystem-icons";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="relative flex h-16 items-center border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-screen-xl px-4 md:px-8">
        <Link href="/" className="flex items-center text-2xl font-bold">
          {config.siteMeta.title}
        </Link>
        <div className="ml-auto flex items-center gap-x-4">
          <Link href="/search">
            <SearchIcon
              className="inline-block w-auto text-2xl text-gray-400"
              width="1em"
              height="1em"
              fill="currentColor"
            />
          </Link>
          {session?.user ? <UserMenu user={session.user} /> : <Login />}
        </div>
      </div>
    </header>
  );
}
