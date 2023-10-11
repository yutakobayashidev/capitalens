import { auth } from "@auth";
import { config } from "@site.config";
import { Login } from "@src/components/login/login";
import UserMenu from "@src/components/user-menu/user-menu";
import { SearchIcon } from "@xpadev-net/designsystem-icons";
import Link from "next/link";
import { Session } from "next-auth";

export function StoryBookHeader({ user }: { user: Session["user"] }) {
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
          {user ? <UserMenu user={user} /> : <Login />}
        </div>
      </div>
    </header>
  );
}

export default async function Header() {
  const session = await auth();

  return <StoryBookHeader user={session?.user} />;
}
