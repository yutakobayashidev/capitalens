import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white pt-10 pb-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="md:grid-cols-4 grid gap-10">
          <div>
            <Link className="mb-3 block text-2xl font-bold" href="/">
              CapitaLens
            </Link>
            <p className="text-gray-500 text-sm">国のデータを整理する</p>
          </div>
          <nav>
            <h4 className="font-bold">プロジェクトについて</h4>
            <ul>
              <li className="my-3">
                <Link className="text-sm hover:underline" href="/about">
                  このサイトについて
                </Link>
              </li>
              <li className="my-3">
                <a
                  className="text-sm hover:underline"
                  href="https://github.com/users/yutakobayashidev/projects/2"
                >
                  開発ロードマップ
                </a>
              </li>
              <li className="my-3">
                <a
                  className="text-sm hover:underline"
                  href="https://forms.gle/d3n196yyQ6V4GdEt6"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </nav>
          <nav>
            <h4 className="font-bold">リンク & ソーシャル</h4>
            <ul>
              <li className="my-3">
                <a
                  className="text-sm hover:underline"
                  href="https://github.com/yutakobayashidev/capitalens"
                >
                  GitHub
                </a>
              </li>
              <li className="my-3">
                <a
                  className="text-sm hover:underline"
                  href="https://discord.gg/tcc5AvRSr9"
                >
                  Discord
                </a>
              </li>
            </ul>
          </nav>
          <nav>
            <h4 className="font-bold">法的</h4>
            <ul>
              <li className="my-3">
                <Link className="text-sm hover:underline" href="/data">
                  使用データ
                </Link>
              </li>
              <li className="my-3">
                <Link className="text-sm hover:underline" href="/privacy">
                  プライバシーポリシー
                </Link>
              </li>
              <li className="my-3">
                <Link className="text-sm hover:underline" href="/guideline">
                  ガイドライン
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-gray-400 text-center pt-4 mt-5 border-t">
          © CapitaLens
        </div>
      </div>
    </footer>
  );
}
