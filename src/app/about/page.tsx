import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "VP of Developer Experience at Vercel.",
};

export default async function Page() {
  return (
    <div className="mx-auto max-w-screen-sm px-4 md:px-8 my-12">
      <section>
        <h1 className="font-bold mb-7 text-3xl md:text-5xl">
          このサイトについて
        </h1>
        <div className="prose">
          <p>
            当サイトでは、国会や地方議会での議員の発言をまとめ、議論や議員ごとが取り組んでいる問題などを視覚的に表示することを目的としています。
          </p>
          <p>
            テキストマイニング技術などを活用し、各議会の会議録や発言を自動的に解析し、重要なキーワードやトピックを抽出しています。また、ブログやSNSなどのオンライン情報も取り込み、より広範な視野から情報を収集しています。
          </p>
          <p>
            当サイトは、公正かつ客観的な情報提供を目指し、市民やメディア、政治家など様々な人々が、正確かつ透明な情報を得ることができる場として、貢献することを目指しています。
          </p>
        </div>
      </section>
    </div>
  );
}
