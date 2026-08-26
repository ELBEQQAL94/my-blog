import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { SITE_NAME } from "@/lib/site";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const DEFAULT_COVER_IMAGE = "/blog/placeholder.svg";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  coverImage: string;
  coverImageAlt: string;
};

export type Post = PostMeta & {
  html: string;
};

type Frontmatter = {
  title: string;
  date: string | Date;
  description: string;
  tags?: string[];
  author?: string;
  coverImage?: string;
  coverImageAlt?: string;
};

function toDateString(date: string | Date): string {
  return date instanceof Date ? date.toISOString().slice(0, 10) : date;
}

function readPostMeta(filename: string): PostMeta {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(POSTS_DIR, filename);
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const frontmatter = data as Frontmatter;

  if (!frontmatter.title || !frontmatter.date) {
    throw new Error(
      `Post "${filename}" is missing required frontmatter (title, date).`
    );
  }

  return {
    slug,
    title: frontmatter.title,
    date: toDateString(frontmatter.date),
    description: frontmatter.description ?? "",
    tags: frontmatter.tags ?? [],
    author: frontmatter.author ?? SITE_NAME,
    coverImage: frontmatter.coverImage ?? DEFAULT_COVER_IMAGE,
    coverImageAlt: frontmatter.coverImageAlt ?? frontmatter.title,
  };
}

export function getAllPosts(): PostMeta[] {
  const filenames = fs
    .readdirSync(POSTS_DIR)
    .filter((filename) => filename.endsWith(".md"));

  return filenames
    .map(readPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const meta = readPostMeta(`${slug}.md`);
  const { content } = matter(fs.readFileSync(filePath, "utf8"));
  const processed = await remark().use(remarkHtml).process(content);

  return { ...meta, html: processed.toString() };
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}
