import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { AuthorByline } from "@/components/author-byline";

export const metadata: Metadata = {
  title: "Writing",
  description: "Posts by Youssef El Beqqal.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Writing</h1>
      <ul className="flex flex-col gap-10">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-zinc-200 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600 sm:flex-row"
            >
              <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-64">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 256px, 100vw"
                  priority={index === 0}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-3 px-5 pb-5 sm:pl-0 sm:pr-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300">
                    {post.description}
                  </p>
                </div>
                <AuthorByline author={post.author} date={post.date} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
