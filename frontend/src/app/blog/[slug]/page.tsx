import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { config } from "@site.config";
import type { Metadata } from "next";
import { FaGithub } from "react-icons/fa";

dayjs.locale("ja");

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
      </div>
    </section>
  );
}
