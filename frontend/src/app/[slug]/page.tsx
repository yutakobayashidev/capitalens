import type { Metadata } from "next";
import { allPages } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { config } from "@site.config";
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
    twitter: {
      card: "summary_large_image",
      title: page.title,
      images: [ogImage],
    },
    openGraph: {
      title: page.title,
      siteName: config.siteMeta.title,
      url: config.siteRoot + page._raw.sourceFileName.replace(".md", ""),
      locale: "ja-JP",
      images: [
        {
          url: ogImage,
        },
      ],
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
    <div className="mx-auto max-w-screen-sm px-4 md:px-8 my-12">
      <section>
        <h1 className="font-bold mb-7 text-4xl text-center">{page.title}</h1>
        <div className="flex items-center mb-5 p-4 text-gray-500 bg-gray-100 rounded-lg">
          <FaGithub className="text-xl mr-2" />
          {page.title}の変更履歴は
          <a
            className="underline text-gray-600"
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
        <div
          className="prose prose-a:no-underline hover:prose-a:underline prose-a:text-primary prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: page.body.html }}
        />
      </section>
    </div>
  );
}
