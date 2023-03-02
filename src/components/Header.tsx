import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="font-bold font-base text-3xl">
            国会発言分析
          </Link>
          <div>
            <Link href="/about" className="font-bold text-lg">
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
