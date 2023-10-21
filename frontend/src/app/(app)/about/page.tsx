import { config } from "@site.config";
import type { Metadata } from "next";
import { FaGithub } from "react-icons/fa";

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "CapitaLensは、一次情報、行政オープンデータ、多くの人に変更されているドキュメントをベースに国や行政の情報を届けることを目指しています。",
};

type GithubUser = {
  id: number;
  avatar_url: string;
  contributions: number;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: "User";
  url: string;
};

export default async function Page() {
  const [contributorsRes, repoRes] = await Promise.all([
    fetch(
      `https://api.github.com/repos/${config.SocialLinks.github.replace(
        "https://github.com/",
        ""
      )}/contributors`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 86400 },
      }
    ),
    fetch(
      `https://api.github.com/repos/${config.SocialLinks.github.replace(
        "https://github.com/",
        ""
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 86400 },
      }
    ),
  ]);

  const contributors: GithubUser[] = await contributorsRes.json();

  const repoData = await repoRes.json();

  return (
    <div>
      <section className="py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="items-start justify-between md:flex">
            <div className="h-auto overflow-hidden rounded-lg xl:w-5/12">
              <h1 className="mb-7 text-center text-3xl font-bold md:text-left md:text-4xl">
                国・行政データを整理する
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
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="items-start justify-between border-b border-gray-100 md:flex">
            <div className="hidden h-auto overflow-hidden rounded-lg md:block xl:w-5/12">
              <img src="/undraw_chat_bot.png" alt="Robot" />
            </div>
            <div className="hidden h-auto overflow-hidden rounded-lg md:block xl:w-5/12">
              <h1 className="mb-7 text-center text-5xl font-bold md:text-left md:text-4xl">
                一次情報を元に情報を提供
              </h1>
              <div className="prose">
                <p>
                  CapitaLensは、一次情報、行政オープンデータ、多くの人に変更されているドキュメントをベースに国や行政の情報を届けることを目指しています。
                </p>
                <p>
                  生成AIなどの技術の登場によって、より多角的な視点からアクセシビリティを考慮した情報が得られるようになりつつあります。
                </p>
              </div>
            </div>
            <div className="block h-auto overflow-hidden rounded-lg md:hidden xl:w-5/12">
              <h1 className="mb-7 text-center text-3xl font-bold md:text-left md:text-4xl">
                一次情報を元に情報を提供
              </h1>
              <div className="prose">
                <p>
                  CapitaLensは、一次情報、オープンデータ、コミュニティをベースに国や行政の情報を届けることを目指しています。
                </p>
                <p>
                  生成AIなどの技術の登場によって、より多角的な視点からアクセシビリティを考慮した情報が得られるようになりつつあります。
                </p>
              </div>
            </div>
            <div className="block h-auto overflow-hidden rounded-lg md:hidden xl:w-5/12">
              <img src="/undraw_AI.png" alt="Robot" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-lg py-12 text-center">
        <h1 className="mb-8 text-3xl font-bold">
          自律的な無人AIメディアを目指して
        </h1>
        <p>
          できるだけ人や根拠のない情報に依存せず、情報の偏りを削減する自律的なメディアの開発や研究を進めていきます。
        </p>
        <div className="flex items-center justify-center py-8">
          <a href={config.SocialLinks.github} className="flex items-center">
            <div className="flex h-10 items-center space-x-2 rounded-md border border-gray-600 bg-gray-800 p-4 font-semibold text-white">
              <FaGithub className="h-5 w-5" />
              <p>Star {repoData.stargazers_count}</p>
            </div>
          </a>
        </div>
      </section>
      <section className="border-y bg-white/10 py-12 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <h2 className="mb-5 text-3xl font-bold">
            CapitaLensの開発に参加しましょう
          </h2>
          <p className="mb-3 text-slate-500">
            CapitaLensはオープンソースとして開発されています。
            <a
              href="https://github.com/yutakobayashidev/capitalens/blob/main/CONTRIBUTING.md"
              className="text-primary hover:underline"
            >
              貢献ガイド
            </a>
            を確認し、是非
            <a
              href={config.SocialLinks.discord}
              className="text-primary hover:underline"
            >
              Discordサーバー
            </a>
            に参加してお気軽に開発にご参加ください。
          </p>
          <h2 className="mb-5 font-bold">コントリビューター</h2>
          <div className="grid grid-cols-5 md:grid-cols-12">
            {contributors.map((contributor) => (
              <a
                href={contributor.html_url}
                key={contributor.id}
                className="h-14 w-14"
              >
                <img
                  className="rounded-full border border-gray-100"
                  src={contributor.avatar_url}
                  alt={contributor.login}
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
