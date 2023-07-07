import { config } from "@site.config";
import type { Metadata } from "next";
import { FaDiscord,FaGithub } from "react-icons/fa";

export const metadata: Metadata = {
  title: "このサイトについて",
};

export default async function Page() {
  return (
    <div>
      <header className="my-8">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="block items-center justify-between md:flex">
            <div className="h-auto overflow-hidden rounded-lg xl:w-5/12">
              <h1 className="mb-7 text-center text-5xl font-bold md:text-left md:text-4xl">
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
            <div className="h-auto overflow-hidden rounded-lg xl:w-5/12">
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
          <h2 className="mb-5 text-center text-4xl font-bold">
            開発に貢献する
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <a
              href={config.SocialLinks.github}
              className="block rounded-lg border px-2 py-4 text-center transition duration-500 hover:bg-gray-100 md:px-2 md:py-6"
            >
              <div className="flex justify-center">
                <FaGithub size={50} />
              </div>
              <div className="mt-5 text-lg font-bold text-gray-700">GitHub</div>
            </a>
            <a
              href={config.SocialLinks.discord}
              className="block rounded-lg border px-2 py-4 text-center transition duration-500 hover:bg-gray-100 md:px-2 md:py-6"
            >
              <div className="flex justify-center">
                <FaDiscord className="text-[#5865F2]" size={50} />
              </div>
              <div className="mt-5 text-lg font-bold text-gray-700">
                Discord
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
