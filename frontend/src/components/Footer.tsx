import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-4 text-center border-t">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="text-gray-400">© CapitaLens</div>
        <nav className="gap-x-4 inline-flex mt-4">
          <a
            href="https://forms.gle/d3n196yyQ6V4GdEt6"
            className="hover:underline text-gray-500"
          >
            お問い合わせ
          </a>
          <Link className="hover:underline text-gray-500" href="/data">
            使用データ
          </Link>
          <Link className="hover:underline text-gray-500" href="/guideline">
            ガイドライン
          </Link>
          <Link className="hover:underline text-gray-500" href="/privacy">
            プライバシーポリシー
          </Link>
        </nav>
      </div>
    </footer>
  );
}
