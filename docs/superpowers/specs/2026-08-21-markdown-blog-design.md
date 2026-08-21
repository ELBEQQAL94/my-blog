# Markdown Blog — Design

## Summary

Turn the fresh `create-next-app` scaffold into a simple markdown-file-backed
personal blog: posts written as local `.md` files with YAML frontmatter,
statically rendered, with tags, an RSS feed, and a manual dark-mode toggle.

## Context

The repo is an unmodified Next.js 16.3.2 (App Router) scaffold — no blog
functionality exists yet. `next.config.ts` does not set `cacheComponents`, so
the app uses Next's standard/previous caching model: reading local files in
an async Server Component is treated as a predictable value and is
automatically included in the static shell at build time via
`generateStaticParams`, the same as classic SSG. No `use cache` directives or
`<Suspense>` choreography are needed for this design.

## Content model

- Posts live as markdown files in `/content/posts/*.md`.
- Filename is the slug: `content/posts/hello-world.md` → `/blog/hello-world`.
- Each file starts with YAML frontmatter:
  ```
  ---
  title: Hello World
  date: 2026-08-21
  description: A short summary shown in the post list and RSS feed.
  tags: [next, blog]
  ---
  Post body in markdown...
  ```
- Frontmatter is parsed with `gray-matter`; the markdown body is converted to
  HTML with `remark` + `remark-html`. No syntax highlighter is included (not
  needed for now).
- Malformed frontmatter (missing `title`/`date`) throws at build time — these
  are the author's own files, not external input, so failing fast beats a
  silent runtime fallback.

## Routes

| Route | Purpose |
|---|---|
| `/` | Post list (home page *is* the blog index — no separate landing page). Shows title, date, description, tags per post, sorted by date descending. |
| `/blog/[slug]` | Individual post. `generateStaticParams` lists all slugs; `generateMetadata` sets per-post title/description. |
| `/tags/[tag]` | Posts filtered to one tag. |
| `/rss.xml` | Route Handler (`app/rss.xml/route.ts`) that builds an XML feed from all posts. `export const dynamic = 'force-static'` so it's generated once at build time. |

## Components & data flow

- `lib/posts.ts` is the single module that touches the filesystem. It
  exposes:
  - `getAllPosts()` — parsed posts, sorted by date descending
  - `getPostBySlug(slug)` — single post, calls `notFound()` if missing
  - `getAllTags()` — unique tag list
  - `getPostsByTag(tag)` — filtered posts

  Every route consumes these functions; nothing else reads `fs` directly.
- `app/page.tsx`, `app/blog/[slug]/page.tsx`, `app/tags/[tag]/page.tsx` are
  Server Components built on top of `lib/posts.ts`.
- Rendered markdown HTML is wrapped in a `prose` container using
  `@tailwindcss/typography` (new dependency) so post bodies are readable
  without hand-styling every HTML tag markdown can produce.

## Dark mode

- Switch `app/globals.css` from the current `prefers-color-scheme` media
  query to Tailwind's `class` strategy, since a manual toggle needs
  JS-controlled state, not just OS preference.
- An inline script in `app/layout.tsx`, run before paint, reads the saved
  theme from `localStorage` and sets the class on `<html>` — this avoids a
  flash of the wrong theme on load.
- `ThemeToggle` is a Client Component (the only one in the app) that flips
  the `<html>` class and updates `localStorage` on click.

## Error handling

- Unknown slug or tag → `notFound()` → Next's default 404 page.
- Malformed frontmatter → throw at build time (see Content model above).

## Testing

- No test framework exists in the repo yet, and this design was scoped to
  skip adding one: verification is `next build` (which exercises static
  generation across every post and would fail loudly on a bad file) plus
  manual browser checks of the list, post, tag, and RSS routes.

## Out of scope (for this pass)

- CMS/database-backed content
- Syntax-highlighted code blocks
- Pagination, search, comments, newsletter
