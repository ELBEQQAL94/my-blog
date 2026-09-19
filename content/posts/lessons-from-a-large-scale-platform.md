---
title: Lessons I'll Never Forget From a Large-Scale Web & Mobile Project
metaTitle: Lessons From a Large-Scale Web Project
date: 2026-08-26
description: Notes on SEO, CDN caching, GraphQL, Expo, API performance, and monitoring from a real large-scale Next.js and React Native project.
author: Youssef El Beqqal
coverImage: /blog/placeholder.svg
coverImageAlt: Lessons I'll Never Forget From a Large-Scale Web & Mobile Project
---

I spent a good chunk of the last while working on a large-scale platform: web
built on Next.js, mobile built on React Native/Expo. Some of these lessons
cost us real time to learn, so I'm writing them down mostly so I don't have to
relearn them the hard way next time.

## Rendering and SEO: the CSR mistake

We defaulted to client-side rendering almost everywhere. It felt fine in
development (everything worked, everything looked right) until we actually
looked at how the site behaved for crawlers.

The nuance matters here: Google *does* execute JavaScript, so a CSR page
isn't invisible to it. But that rendering happens in a deferred second pass,
which can delay indexing significantly. The bigger issue is everything that
isn't Googlebot: Bing, and especially link-preview crawlers (Slack,
Twitter/X, LinkedIn, WhatsApp) don't render JavaScript at all. Ship a page as
pure client components and those crawlers see an empty shell: broken previews,
missing OG tags, nothing to index. On top of that, CSR tanks your Core Web
Vitals, which is itself a ranking signal.

Next.js gives you the primitives to avoid this (server components,
`generateMetadata`, `sitemap.ts`), but it doesn't force the decision on you.
You still have to consciously choose server rendering for anything that needs
to be crawlable, and we didn't do that early enough. We also ended up building
our sitemap generation from scratch, pulling every route ourselves rather than
getting it for free, which, in hindsight, is just the cost of that same
default rendering choice compounding.

## Caching at the edge: CDN cache tags

Once pages were actually server-rendered, the next problem was keeping the
CDN (Akamai, in our case) in sync with reality. Akamai doesn't know when your
data changes. You have to tell it, explicitly, and that meant writing custom
invalidation logic ourselves rather than relying on anything out of the box.

The approach that worked: tag every cached response with a cache tag, and
make sure that tag matches an identifier the backend also knows about. When a
piece of data changes on the backend, you purge by that tag instead of
guessing at URLs. It works, but it's entirely on you to build and keep
consistent across environments. Get the tag naming wrong in one environment
and you get stale content that's very hard to explain.

## Prefetching quietly killed performance after every deploy

This one was subtle. Next.js's `<Link>` component prefetches routes
automatically, not on every page load, but as each link scrolls into the
viewport, it fires a prefetch request for the full route behind it. On a page
with a long list of links, that's a lot of prefetch requests firing at once.

Right after a deploy, the CDN cache is cold. Every one of those viewport
prefetches turns into a real request that has to be filled from origin. The
site felt sluggish immediately post-deploy, and it took a while to connect
"slow after deploy" to "prefetch is stampeding the cache before it's had a
chance to warm up." The fix is straightforward once you know what's
happening: disable or defer prefetch (`prefetch={false}`, or hover-triggered
prefetch) on pages with large link lists. But it's not something you'd guess
from the default behavior alone.

## GraphQL and the one-endpoint caching problem

We used GraphQL, and the main friction point was caching. A CDN caches by
URL and method by default, and GraphQL is usually a single `POST /graphql`
endpoint: every query looks identical to the cache, so there's nothing to
key on.

The bigger lesson, though, wasn't really about the CDN. It was about
discipline in how we used GraphQL from the client at all. The real fix was
avoiding calling for data on the client that we didn't actually need in the
first place. A flexible query language makes it very easy to over-fetch
without noticing, and every one of those queries is a cache-invalidation
problem waiting to happen.

## React Native / Expo: things nobody warns you about

This is the list I'd hand to anyone starting a React Native/Expo project:

- **Old devices are a real constraint.** Support isn't guaranteed the way it
  often is on the web, and you'll find out the hard way on lower-end hardware.
- **Memory management issues show up in production, not locally.** Code that
  runs fine on a dev build can crash in production, and reproducing it
  locally, tracing whether it's network, memory, or an SDK compatibility
  issue, is genuinely difficult.
- **Large lists and media need real attention.** Rendering big data lists or
  audio/video without understanding how React Native handles that will bite
  you on performance. Switching to a virtualized list implementation (we moved
  to `FlashList`) was necessary, not optional.
- **Avoid WebViews for anything requiring authentication.** If you need to
  render a web view that depends on a logged-in user, don't reach for a
  WebView: session/cookie handling across the native/web boundary is a
  constant source of pain.
- **Expo SDK upgrades are the worst part of the whole stack.** Migrating
  between SDK versions is consistently the most painful, unpredictable part
  of maintaining a React Native/Expo app.

## API performance: the request you didn't need to make

One recurring issue: the same piece of data, referenced by the same ID,
fetched over and over. A list where multiple items point at the same
underlying entity would trigger a separate API call per item instead of
fetching it once and reusing it. Multiply that across a list and you get a
burst of redundant requests for information the client already has. The fix
is caching by key: fetch once per ID, reuse everywhere it's needed, instead
of treating every reference as a fresh call.

The other side of this was race conditions, which are close to impossible to
catch in lower environments. They only really show up under real concurrent
production traffic, which makes them expensive to diagnose after the fact.

This is also a real blind spot for AI coding agents. A
model looking at the code in front of it can suggest a fix for that one call
site, but it doesn't have the runtime picture (concurrent requests, timing,
shared state across services) to notice that two calls are duplicating work,
or that a "fix" just introduced a race condition elsewhere. That's a class of
bug that needs production-like conditions to surface, for humans and AI
agents alike.

## Monitoring: knowing something broke isn't the same as knowing why

For mobile, we relied on Firebase Analytics for monitoring. It tells you
*that* something happened (a crash, a drop-off) but not *why*. No real
root-cause detail. In practice, the fallback was adding more logging by hand
to narrow down where a crash was actually happening, which is a workaround,
not a solution. It's the gap I'd prioritize closing first on the next
project.

---

None of this is exotic. Most of it is "read the docs for the specific
version you're on, and don't assume the framework handles it for you." But
that's exactly why it's worth writing down: the lessons that cost the most
time are rarely the exotic ones.
