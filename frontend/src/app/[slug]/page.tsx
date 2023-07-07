import { config } from "@site.config";
import { allPages } from "contentlayer/generated";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaGithub } from "react-icons/fa";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const page = allPages.find(
    (post) => post._raw.sourceFileName.replace(".md", "") === params.slug
  );

  if (!page) {
    notFound();
  }

  const ogImage = `${config.siteRoot}opengraph.jpg`;

  return {
    title: page.title,
    openGraph: {
      title: page.title,
      images: [
        {
          url: ogImage,
        },
      ],
      locale: "ja-JP",
      siteName: config.siteMeta.title,
      url: config.siteRoot + page._raw.sourceFileName.replace(".md", ""),
    },
    twitter: {
      title: page.title,
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = allPages.find(
    (post) => post._raw.sourceFileName.replace(".md", "") === params.slug
  );

  if (!page) {
    notFound();
  }

  return (
    <section className="my-12">
      <div className="mx-auto max-w-screen-sm px-4 md:px-8">
        <h1 className="mb-7 text-center text-4xl font-bold">{page.title}</h1>
        <div className="mb-5 flex items-center rounded-lg bg-gray-100 p-4 text-gray-500">
          <FaGithub className="mr-2 text-xl" />
          <div className="flex-1">
            {page.title}の変更履歴は
            <a
              className="text-gray-600 underline"
              href={
                config.SocialLinks.github +
                "/commits/main/frontend/content/page/" +
                page._raw.sourceFileName
              }
            >
              GitHub
            </a>
            で確認できます
          </div>
        </div>
        <div
          className="prose prose-neutral max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: page.body.html }}
        />
      </div>
    </section>
  );
}
