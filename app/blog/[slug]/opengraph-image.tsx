import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const avatarBuffer = await readFile(join(process.cwd(), "public/avatar-og.png"));
  const avatarSrc = `data:image/png;base64,${avatarBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #18181b 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={avatarSrc}
            width={48}
            height={48}
            style={{ borderRadius: 9999 }}
          />
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#e4e4e7" }}>
            {SITE_NAME}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            color: "#f4f4f5",
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </div>
      </div>
    ),
    { ...size }
  );
}
