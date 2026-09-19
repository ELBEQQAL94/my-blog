---
name: moneyflow-seo
description: MoneyFlow's actual implemented SEO strategy and conventions on getmoneyflow.app - metadata pattern, JSON-LD types in use, sitemap/robots setup, llms.txt/llms-full.txt maintenance, blog internal-linking convention, and the cover-image pipeline. Use when adding a new page, publishing a blog post, or auditing this specific site's SEO - not a generic Next.js SEO tutorial (see nextjs-seo / llm-seo for that).
---

# MoneyFlow SEO Strategy

This documents how SEO is actually implemented in this codebase, so new pages and posts stay consistent with what's already here instead of reinventing a pattern. For general Next.js/LLM SEO best practice (not specific to this site), use the `nextjs-seo` and `llm-seo` skills instead.

## Metadata pattern

Every route builds its `Metadata` through `lib/seo.ts`'s `buildPageMetadata({ title, description, path, ogTitle?, ogDescription? })` rather than declaring `openGraph`/`twitter` inline. This exists because Next.js does not deep-merge `openGraph`/`twitter` across route segments - a page declaring its own `openGraph` object entirely replaces the root layout's (including the image from `app/opengraph-image.tsx`), silently leaving the page with no share image if you skip the helper. `SITE_URL` and `DEFAULT_OG_IMAGE` also live in `lib/seo.ts` - don't hardcode the domain or a one-off OG image elsewhere.

Blog posts (`app/blog/[slug]/page.tsx`) build metadata directly (not through the helper) since they need `type: "article"`, `publishedTime`, and `authors` - keep that page's `generateMetadata` as the reference for article-type pages.

## JSON-LD in use

- **`app/layout.tsx`** (site-wide): `Organization`, `WebSite`, `Person` (founder/bio)
- **Home, About, Safe-to-Spend, Debt Payoff Planner, Net Worth Tracker, comparison pages**: `SoftwareApplication` + nested `Offer`
- **Support, Safe-to-Spend, Debt Payoff Planner, Net Worth Tracker, Budgeting Without a Bank Account, How to Budget, comparison pages, and any blog post using `<FaqSection>`**: `FAQPage` (generated automatically by `components/shared/FaqSection.tsx` from its `faqs` prop - don't hand-write a separate FAQPage block if you're already using that component)
- **Blog posts**: `Article`
- **Free Tools, Compare index pages**: `ItemList`

When adding a new page, match it to the closest existing type above rather than inventing a new JSON-LD shape. If a page has an FAQ section, use `<FaqSection>` - it's the only place FAQPage schema is generated, so skipping it means silently losing that markup.

## Sitemap & robots

`app/sitemap.ts` combines a hardcoded `staticRoutes` array with dynamically-generated blog routes from `getAllPosts()`. **New non-blog pages must be added to `staticRoutes` by hand** - blog posts are automatic. `app/robots.ts` allows all crawlers and points to the sitemap; there's no per-bot rule differentiation currently.

## llms.txt / llms-full.txt

Both are static files under `public/`, not auto-generated - see the "LLM Reference Files" section in `CLAUDE.md` for the exact update procedure. In short: every new blog post's full text gets appended to `public/llms-full.txt` (newest first), and every new standalone page gets a bullet in `public/llms.txt`'s `## Key Resources` plus a mirror entry in `app/for-llms/page.tsx`. This is the single most likely thing to go stale - check it whenever blog content ships.

## Blog internal-linking convention

Existing posts cross-link to related posts and product pages inline, mid-sentence, using descriptive anchor text tied to the linked page's topic - not bare "click here" or trailing "read more" links. For example: `[how often it's actually worth checking](/blog/how-often-should-you-check-your-investments)`. Every post should link to at least one other post or tool page this way; it's what feeds `getRelatedPosts()`'s category-based matching and keeps topic clusters connected for both crawlers and readers.

## Blog slug length

A blog post's slug is its `.mdx` filename in `content/blog/` (there's no separate `slug` frontmatter field), and it doubles as the URL path segment. New post slugs should be short and keyword-first - a crawler or LLM should be able to infer the topic and target audience from the slug alone without opening the page. Aim for roughly under 40 characters and cut filler words/phrases: prefer `how-to-set-a-savings-goal` over `how-to-set-a-savings-goal-youll-actually-hit`; prefer `is-linking-bank-account-safe` over `is-it-safe-to-link-your-bank-account-to-a-budgeting-app`. This applies to new posts only - don't rename existing posts' slugs to shorten them, since that changes indexed URLs and would need 301 redirects to avoid breaking backlinks/search rankings.

## Primary keyword naturalness

Every post's primary keyword is inferred from its `title`/`metaTitle` frontmatter (there's no dedicated `keyword` field). Before publishing or editing a post, check that the keyword or a close natural variant actually shows up in the body prose - not just in frontmatter (`title`, `metaTitle`, `description`, `summary`), which crawlers weight far less than on-page text:
- It should appear early, ideally the intro paragraph, not buried or absent entirely.
- Synonyms/variants are good, not a problem (e.g. "benchmarks" for "milestones," "beyond your means" for "above your means") - don't force the exact phrase if a natural variant already covers it.
- Flag only real gaps: the operative word from the title missing from the whole body (e.g. a post titled "...Budget Checklist" that never says "checklist" anywhere in its content), or the reverse - the same exact phrase stuffed 4+ times, which reads robotic.
- For `moneyflow-vs-*` comparison posts, also check that MoneyFlow and the competitor name appear in roughly balanced counts, not one-sided promotional stuffing.

When fixing a gap, prefer a minimal, natural sentence tweak (reword an existing sentence to include the term) over bolting on a new paragraph just to hit the keyword.

## Post `updatedAt` frontmatter

Blog posts support an optional `updatedAt` frontmatter field (`lib/blog.ts`), which feeds JSON-LD `dateModified`, the OG `modifiedTime`, and an "Updated {date}" suffix next to the byline (`app/blog/[slug]/page.tsx`) - `date` alone still drives `datePublished`/OG `publishedTime` and is never overwritten.

Only add or bump `updatedAt` when a post that's **already published** (`date` is today or in the past, per `isPublished()`) gets its body content meaningfully revised after the fact. Don't add it to a still-future-dated, unpublished post you're editing pre-launch - there's nothing to have "updated" yet since it hasn't gone live. Set it to today's date in `YYYY-MM-DD` format, same as `date`. If the post's body text is also mirrored in `public/llms-full.txt` (see below), update that copy too so the two don't drift.

## Cover images

Raw jpg/png cover images get converted via `node scripts/convert-to-webp.mjs public/blog/images --replace` (run by the engineer, not automatically - see CLAUDE.md's "Running Commands" rule). `--replace` deletes the source file once the `.webp` exists. Frontmatter's `coverImage` path always points at the `.webp`, even mid-conversion when only the raw file exists on disk yet.

## Footer & nav link architecture

The footer (`components/layout/Footer.tsx`) doubles as an internal-linking surface for SEO: a link-dump row (Free Tools, Compare, Guides, recent Blog posts) plus a second row (Product/Resources/Legal). When adding a new standalone page, consider whether it belongs in one of these footer columns, not just the sitemap - internal links from every page (via the footer) carry more link equity than a sitemap-only entry.

## Title length budget (`<title>` tag)

The root layout's template appends `" - MoneyFlow"` (13 chars) to any title that doesn't already contain the word "MoneyFlow" (see `resolveTitle()` in `lib/seo.ts`). Google truncates around 60 characters, so:
- A raw title **without** "MoneyFlow" in it must stay ≤ 47 characters (47 + 13 = 60).
- A title that already contains "MoneyFlow" (comparison pages, some blog titles) becomes absolute via `resolveTitle()` and gets no suffix, so it can run up to 60 characters itself.

Blog posts support an optional `metaTitle` frontmatter field (`lib/blog.ts`, consumed in `app/blog/[slug]/page.tsx`'s `generateMetadata`) specifically so the `<title>`/OG title can be trimmed to fit that budget **without** rewriting the on-page H1 (which still renders `post.title` as-is, and can stay longer/more descriptive - SF only flags H1s over ~70 characters as an opportunity, not a hard limit). Only add `metaTitle` when the plain `title` would exceed the 60-char rendered budget; otherwise omit it and let `title` serve both roles. This mirrors the pattern comparison pages already use (`metaTitle` vs `h1` in `lib/comparisons/*.ts`).

## Blog internal links must never target an unpublished post

`isPublished()` in `lib/blog.ts` hides any post whose `date` is in the future (per the 2-posts/day schedule in `CLAUDE.md`), and `getPostBySlug()` 404s for it. Cross-linking is expected (see "Blog internal-linking convention" above) but **never link to a post whose `date` is later than the linking post's own `date`** - that link will 404 for however many days separate the two publish dates. Before adding a cross-link to a just-drafted or future post, check its frontmatter `date` against the linking post's `date`. If the target isn't live yet and won't be by the time the source publishes, either hold the link until both are live, or write the anchor text as plain (non-linked) text for now.

## Blog pagination (`app/blog/page.tsx`) must vary per page

`/blog?page=N` for N > 1 needs a distinct `title`, meta `description`, and H1 from page 1 and from each other - reusing the literal "Blog" title/description across every paginated page reads as duplicate-title/duplicate-description to crawlers. The existing pattern appends `- Page ${page}` to the title/H1 and swaps in a page-aware description string when `page > 1`. Also watch the prev/next link math: a "Previous" link from page 2 must resolve to `/blog` (not `/blog?page=1`) - `/blog?page=1` is a distinct crawlable URL whose canonical points back to `/blog`, which trips Screaming Frog's "Canonicalised" check. Any new paginated listing (if one gets added elsewhere) should follow this same page-1-has-no-query-param convention.

## Site-wide security headers

`next.config.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy` globally via `headers()`. If you add a new external script/API host (analytics, a form backend, an embed), you must add its origin to the relevant CSP directive there (`script-src`, `connect-src`, or `form-action`) or it will be silently blocked in production. Current allowances: Google Tag Manager (`script-src`, `connect-src`), Google Analytics collection endpoints (`connect-src`), Formspree (`connect-src` + `form-action`). The CSP intentionally allows `'unsafe-inline'` for scripts/styles because the site relies on inline `<script type="application/ld+json">` JSON-LD blocks (used extensively - see "JSON-LD in use" above) and the inline GA bootstrap snippet in `components/layout/CookieConsent.tsx`; there's no nonce infrastructure, so don't tighten this without adding one.

## `next/image fill` and "missing size attributes" audits

Blog thumbnails (`BlogList.tsx`, `RelatedArticles.tsx`, `RecentArticles.tsx`, `AuthorByline.tsx`, `app/blog/[slug]/page.tsx`) intentionally use `<Image fill>` inside a parent `div` with explicit CSS sizing (e.g. `className="relative h-48 w-full ..."`). `fill` images render without HTML `width`/`height` attributes by design - crawler tools like Screaming Frog flag this as "Images: Missing Size Attributes," but it's not a real CLS risk here because the parent container already reserves the space via CSS. Don't convert these to fixed `width`/`height` Image props just to silence that check; it would require reworking the responsive layout for no real Core Web Vitals benefit. Only worry about this check for a genuinely un-sized image (no CSS-constrained parent).

## Featured snippet ("position zero") formatting

This is a writing convention, not a code pattern - no components or schema change with it. Reality check before chasing this: Google only pulls featured snippets from pages already ranking roughly top 5-10 for a query, so this is a "build the habit now, cash in as rankings climb" practice, not an immediate-win tactic given most of this site's content currently ranks well outside that range (see Search Console position data).

Google pulls three snippet shapes, each triggered by a different query pattern:
- **Paragraph snippets** (most common) - "what is," "why does," "is it safe to" queries. Google extracts a ~40-60 word paragraph sitting immediately under a heading that closely mirrors the query wording. This is the best fit for this blog, since many post titles are already phrased as questions (e.g. "What Is Safe-to-Spend?", "Is It Safe to Link Your Bank Account to a Budgeting App?").
- **List snippets** - "how to," "steps to," "ways to" queries. Needs a real `<ol>`/`<ul>` (the MDX pipeline already renders these correctly via `mdxComponents`), not steps described in prose.

**General rule, not just for snippet-targeting headings:** whenever a post's body enumerates steps, tips, or any other multi-item sequence, write it as a real markdown list (`<ol>` for ordered steps, `<ul>` for unordered tips) instead of burying items in a prose paragraph or run-on sentence. This applies to any post, not only ones chasing a "how to"/"steps to" query - a paragraph like "first check X, then look at Y, and finally consider Z" should become a list. Do this for new posts you write and any existing post you edit where you spot steps/tips still in prose form.
- **Table snippets** - comparison/lookup queries. The `moneyflow-vs-*` pages' feature-comparison table (`ComparisonPage.tsx`) already satisfies this for competitor queries.

**General rule, not just for snippet-targeting headings:** whenever a post's body presents comparison data or metrics - two or more options compared side by side across the same attributes, or a set of numbers/rates/timeframes that line up under shared columns - write it as a real markdown table instead of a prose paragraph or a bullet list trying to fake columns. A sentence like "Option A costs $X and takes Y years, while Option B costs $Z and takes W years" should become a table. `mdxComponents` in `app/blog/[slug]/page.tsx` styles `table`/`thead`/`tbody`/`th`/`td` (bordered, scrollable on mobile) - a bare markdown table (`| Header | Header |`) renders correctly without extra markup. Do this for new posts you write and any existing post you edit where you spot comparison data still in prose form.

**Checklist for new/edited posts:**
- When a title or H2 is phrased as a question, the very next paragraph must answer it directly in the first sentence - no anecdote or setup before the answer. Target 40-60 words for that answering sentence/paragraph.
- Phrase the heading the way someone would actually type the query, not a stylized rewrite of it.
- "How to X" content must use a real markdown list, one self-contained action per item (verb-first), 4-8 items where possible.
- Don't spread direct-answer treatment across every heading in a post - pick the one heading that should own the primary target query.
- Give the direct answer before any hedging ("it depends, but generally X" - not "it depends on a few things" followed by the answer three sentences later).

**The `summary` frontmatter field is the primary lever.** It renders as the "TL;DR" box immediately under the H1 (`app/blog/[slug]/page.tsx`) - exactly the position Google favors for paragraph snippets - but it's currently written as a lede/scene-setter rather than a direct answer. Going forward, write `summary` as if it's the paragraph Google would extract: direct answer in the first sentence, supporting nuance after, no clause that only makes sense with earlier context. Example - instead of *"Budgets usually fail from too much upfront complexity or unrealistic category limits, not a lack of willpower - the moment maintaining the system takes more effort than it gives back..."*, front-load it: *"Budgets fail when they take more effort to maintain than the useful information they give back - usually from too much upfront complexity or unrealistic category limits, not a lack of willpower."* Same content, reordered so the first sentence alone is a complete, quotable answer.

No automated verification exists for this (it's an editorial convention, not a build check) - the only way to confirm it worked is checking whether a snippet appears for a post's target query once that post is indexed and ranking.

## Semantic HTML: quotes and dates

Beyond lists and tables (above), use the semantically-correct tag for other structured content rather than a generic `<p>`/`<span>`:
- **Quotes** - a pulled quote or cited passage should be a markdown blockquote (`> text`), which `mdxComponents` in `app/blog/[slug]/page.tsx` renders as a real `<blockquote>` (styled with a left border) - not a `<p>` with quotation marks typed into the text.
- **Dates** - any published/updated date rendered on a page must be a `<time dateTime="YYYY-MM-DD">` element, not plain text in a `<p>`. `formatPostDate()` in `lib/blog.ts` is the shared formatter; `AuthorByline` (`components/blog/AuthorByline.tsx`) takes raw ISO `date`/`updatedDate` props and renders the `<time>` tags itself - pass the raw ISO string from `post.date`/`post.updatedAt`, don't pre-format it into a string before handing it to the component. `BlogList.tsx`'s post-card date follows the same pattern directly.

This is a general "use the semantic tag, not a generic one" convention, not limited to these two cases - apply the same judgment (`<article>` for the post body, `<nav>` for the jump-to-section list, etc. - already in place) to any new structured content you add.
