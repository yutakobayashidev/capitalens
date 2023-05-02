import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-4 text-center text-gray-400 border-t">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div>© 国会発言分析</div>
        <div>
          <Link className="mt-2 underline inline-flex" href="/policy">
            Website Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
