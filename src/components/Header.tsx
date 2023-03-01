import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-base">
            国会発言分析
          </Link>
          <div>
            <Link href="" className="font-bold text-lg">
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
