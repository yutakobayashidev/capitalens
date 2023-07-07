import { loadGoogleFont } from "@src/lib/font";
import { allBlogs } from "contentlayer/generated";
import { ImageResponse } from "next/server";

export const size = {
  height: 630,
  width: 1200,
};

export default async function og({ params }: { params: { slug: string } }) {
  const blog = allBlogs.find(
    (post) => post._raw.sourceFileName.replace(".md", "") === params.slug
  );

  const notoSansArrayBuffer = await loadGoogleFont({
    family: "Noto Sans JP",
    weight: 700,
  });

  if (blog) {
    return new ImageResponse(
      (
        <div
          style={{
            alignItems: "center",
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          ></div>
          <div
            style={{
              color: "black",
              display: "flex",
              fontSize: 55,
              fontStyle: "normal",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            <b>{blog.title}</b>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "NotoSansJP",
            data: notoSansArrayBuffer,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } else {
    return new Response("Not Found", { status: 404 });
  }
}
