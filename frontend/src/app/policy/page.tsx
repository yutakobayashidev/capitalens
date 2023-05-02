import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サイトポリシー",
};

export default async function Page() {
  return (
    <div className="mx-auto max-w-screen-sm px-4 md:px-8 my-12">
      <section>
        <h1 className="font-bold mb-7 text-3xl md:text-5xl">サイトポリシー</h1>
        <div className="prose">
          <h2>当サイトが使用しているアクセス解析ツールについて</h2>
          <p>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
            このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
            このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
            この規約に関して、詳しくは この規約に関して、詳しくは
            <a href="https://www.google.com/analytics/terms/jp.html">こちら</a>
            をご覧ください。
          </p>
        </div>
      </section>
    </div>
  );
}
