import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-bold font-base text-2xl md:text-3xl flex items-center"
          >
            国会発言分析
            <span className="text-sm ml-3 text-gray-400 border py-0.5 px-1 font-medium rounded-md">
              BETA
            </span>
          </Link>
          <div>
            <Link href="/about" className="font-bold text-base md:text-lg">
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
