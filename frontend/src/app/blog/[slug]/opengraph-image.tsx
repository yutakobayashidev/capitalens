import { ImageResponse } from "next/server";
import { allBlogs } from "contentlayer/generated";
import { loadGoogleFont } from "@src/lib/font";

export const size = {
  width: 1200,
  height: 630,
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
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              fontSize: 55,
              fontStyle: "normal",
              color: "black",
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
