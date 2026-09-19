import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata(
  props: PageProps<"/tags/[tag]">
): Promise<Metadata> {
  const { tag } = await props.params;
  return {
    title: `Posts tagged "${tag}"`,
    description: `Posts by Youssef El Beqqal tagged "${tag}".`,
    alternates: {
      canonical: `/tags/${tag}`,
    },
  };
}

export default async function TagPage(props: PageProps<"/tags/[tag]">) {
  const { tag } = await props.params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Posts tagged &ldquo;{tag}&rdquo;
      </h1>
      <ul className="flex flex-col gap-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold tracking-tight hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={post.date}>{post.date}</time>
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              {post.description}
            </p>
          </li>
        ))}
      </ul>
      <Link href="/" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
        ← Back to all posts
      </Link>
    </main>
  );
}
