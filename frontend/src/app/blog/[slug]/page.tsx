import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { config } from "@site.config";
import type { Metadata } from "next";
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
  username: string;
  avatar: string;
  url: string;
};

export interface GitHubRepositoryInterface {
  getContributorsByFile(slug: string): Promise<Contributor[]>;
}

interface Author {
  name: string;
  email: string;
  date: string;
}

interface Committer {
  name: string;
  email: string;
  date: string;
}

interface Tree {
  url: string;
  sha: string;
}

interface Verification {
  verified: boolean;
  reason: string;
  signature?: any;
  payload?: any;
}

interface Commit {
  url: string;
  author: Author;
  committer: Committer;
  message: string;
  tree: Tree;
  comment_count: number;
  verification: Verification;
}

interface Author2 {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Committer2 {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface Parent {
  url: string;
  sha: string;
}

export interface CommitResponse {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: Commit;
  author: Author2;
  committer: Committer2;
  parents: Parent[];
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
      next: { revalidate: 86400 },
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const json: CommitResponse[] = await res.json();

  const contributors = json
    .map((commit) => {
      return {
        username: commit.author.login,
        avatar: commit.author.avatar_url,
        url: commit.author.html_url,
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
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      images: [ogImage],
    },
    openGraph: {
      title: blog.title,
      siteName: config.siteMeta.title,
      url:
        config.siteRoot + "blog/" + blog._raw.sourceFileName.replace(".md", ""),
      locale: "ja-JP",
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
        <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
        <time className="text-gray-400 text-lg">
          {dayjs(blog.date).format("YYYY/MM/DD")}
        </time>
        <div
          className="prose prose-a:no-underline mt-3 hover:prose-a:underline prose-a:text-primary prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.body.html }}
        />
        <a
          href={`https://github.com/yutakobayashidev/capitalens/blob/main/frontend/content/blog/${blog._raw.sourceFileName}`}
          className="items-center rounded-lg font-semibold inline-flex px-4 py-2 mt-4 bg-[#171515] text-white"
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
