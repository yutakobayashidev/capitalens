import type { Metadata } from "next";
import Link from "next/link";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { config } from "@site.config";

export const metadata: Metadata = {
  title: "このサイトについて",
};

export default async function Page() {
  return (
    <div>
      <header className="my-8">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="block md:flex justify-between items-center">
            <div className="xl:w-5/12 h-auto overflow-hidden rounded-lg">
              <h1 className="font-bold text-center md:text-left mb-7 text-5xl md:text-4xl">
                国会をもっとシンプルに
              </h1>
              <div className="prose">
                <p>
                  自分が住む国で、議会や議員がどのような問題について取り組んでいるのか・どのようなことが行われているかについての情報に詳しくアクセスできないのは問題ではないでしょうか？
                </p>
                <p>
                  本サイトは、散らばった日本のあらゆるオープンデータを1つにまとめて、視覚的な情報提供を目指します。
                </p>
              </div>
            </div>
            <div className="xl:w-5/12 h-auto overflow-hidden rounded-lg">
              <img
                src="/undraw_Brainstorming_re_1lmw.png"
                alt="undraw_Brainstorming_re_1lmw"
              />
            </div>
          </div>
        </div>
      </header>
      <section className="my-8">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <h2 className="text-4xl text-center font-bold mb-5">
            開発に貢献する
          </h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Link
              href={config.SocialLinks.github}
              className="rounded-lg hover:bg-gray-100 transition duration-500 border block text-center md:px-2 md:py-6 py-4 px-2"
            >
              <div className="flex justify-center">
                <FaGithub size={50} />
              </div>
              <div className="mt-5 text-gray-700 font-bold text-lg">GitHub</div>
            </Link>
            <Link
              href={config.SocialLinks.discord}
              className="rounded-lg hover:bg-gray-100 transition duration-500 border block text-center md:px-2 md:py-6 py-4 px-2"
            >
              <div className="flex justify-center">
                <FaDiscord className="text-[#5865F2]" size={50} />
              </div>
              <div className="mt-5 text-gray-700 font-bold text-lg">
                Discord
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
