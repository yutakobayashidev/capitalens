import "dayjs/locale/ja";

import { config } from "@site.config";
import { allBlogs } from "contentlayer/generated";
import dayjs from "dayjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaGithub } from "react-icons/fa";

dayjs.locale("ja");

function getFilePath(slug: string): string {
  return `frontend/content/blog/${slug}.md`;
}

const botUsers = [
  "github-actions[bot]",
  "actions-user",
  "dependabot[bot]",
  "renovate[bot]",
];

export type Contributor = {
  avatar: string;
  url: string;
  username: string;
};

export interface GitHubRepositoryInterface {
  getContributorsByFile(slug: string): Promise<Contributor[]>;
}

interface Author {
  name: string;
  date: string;
  email: string;
}

interface Committer {
  name: string;
  date: string;
  email: string;
}

interface Tree {
  sha: string;
  url: string;
}

interface Verification {
  payload?: any;
  reason: string;
  signature?: any;
  verified: boolean;
}

interface Commit {
  author: Author;
  comment_count: number;
  committer: Committer;
  message: string;
  tree: Tree;
  url: string;
  verification: Verification;
}

interface Author2 {
  id: number;
  avatar_url: string;
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
  type: string;
  url: string;
}

interface Committer2 {
  id: number;
  avatar_url: string;
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
  type: string;
  url: string;
}

interface Parent {
  sha: string;
  url: string;
}

export interface CommitResponse {
  author: Author2;
  comments_url: string;
  commit: Commit;
  committer: Committer2;
  html_url: string;
  node_id: string;
  parents: Parent[];
  sha: string;
  url: string;
}

function removeDeplicateContributors(
  contributors: Contributor[]
): Contributor[] {
  const uniqueContributors: Contributor[] = [];
  contributors.forEach((contributor) => {
    if (
      !uniqueContributors.some(
        (uniqueContributor) =>
          uniqueContributor.username === contributor.username
      )
    ) {
      uniqueContributors.push(contributor);
    }
  });
  return uniqueContributors;
}

async function getContributorsByFile(slug: string) {
  const res = await fetch(
    `https://api.github.com/repos/yutakobayashidev/capitalens/commits?path=${getFilePath(
      slug
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 86400 },
    }
  );

  const json: CommitResponse[] = await res.json();

  const contributors = json
    .map((commit) => {
      return {
        avatar: commit.author.avatar_url,
        url: commit.author.html_url,
        username: commit.author.login,
      };
    })
    .filter((contributor) => !botUsers.includes(contributor.username));

  return removeDeplicateContributors(contributors);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const blog = allBlogs.find(
    (post) => post._raw.sourceFileName.replace(".md", "") === params.slug
  );

  if (!blog) {
    notFound();
  }

  const ogImage =
    config.siteRoot +
    "blog/" +
    blog._raw.sourceFileName.replace(".md", "") +
    "/" +
    "opengraph-image";

  return {
    title: blog.title,
    openGraph: {
      title: blog.title,
      locale: "ja-JP",
      siteName: config.siteMeta.title,
      url:
        config.siteRoot + "blog/" + blog._raw.sourceFileName.replace(".md", ""),
    },
    twitter: {
      title: blog.title,
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const blog = allBlogs.find(
    (post) => post._raw.sourceFileName.replace(".md", "") === params.slug
  );

  if (!blog) {
    notFound();
  }

  const contributors = await getContributorsByFile(params.slug);

  return (
    <section className="my-12">
      <div className="mx-auto max-w-screen-sm px-4 md:px-8">
        <h1 className="mb-3 text-3xl font-bold">{blog.title}</h1>
        <time className="text-lg text-gray-400">
          {dayjs(blog.date).format("YYYY/MM/DD")}
        </time>
        <div
          className="prose prose-neutral mt-3 max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: blog.body.html }}
        />
        <a
          href={`https://github.com/yutakobayashidev/capitalens/blob/main/frontend/content/blog/${blog._raw.sourceFileName}`}
          className="mt-4 inline-flex items-center rounded-lg bg-[#171515] px-4 py-2 font-semibold text-white"
        >
          <FaGithub className="mr-2 text-xl" />
          GitHubで編集を提案
        </a>
        {contributors.length !== 0 && (
          <>
            <h2 className="mb-2 mt-5 text-lg font-bold">この記事の貢献者</h2>
            {contributors.map((contributor) => (
              <div
                className="flex items-center gap-4"
                key={contributor.username}
              >
                <a
                  href={contributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={contributor.avatar}
                    alt={contributor.username}
                  />
                </a>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
