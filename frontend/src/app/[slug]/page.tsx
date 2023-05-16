import type { Metadata } from "next";
import { allPages } from "contentlayer/generated";
import { notFound } from "next/navigation";

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

  const ogImage = `https://parliament-data.vercel.app/opengraph.jpg`;

  return {
    title: page.title,
    twitter: {
      card: "summary_large_image",
      title: page.title,
      images: [ogImage],
    },
    openGraph: {
      title: page.title,
      siteName: "国会発言分析",
      url: `https://parliament-data.vercel.app/${page._raw.sourceFileName.replace(
        ".md",
        ""
      )}`,
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
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: page.body.html }}
        />
      </section>
    </div>
  );
}
