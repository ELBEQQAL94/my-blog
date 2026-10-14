---
title: Why we replaced a single AI agent with three specialized agents at Arsenal FC
metaTitle: Multi-Agent RAG Architecture with LangGraph
date: 2026-10-14
description: How we moved a monolithic RAG agent to a LangGraph router with three specialized agents, and what it changed for hallucinations, retrieval, and monitoring in production.
tags: [rag, langgraph, ai-agents, aws]
author: Youssef El Beqqal
coverImageAlt: Diagram of a central router directing queries to three specialized AI agents
---

Our first AI assistant at Arsenal FC was one agent with one knowledge base. It
worked in demos. In production it started giving answers that sounded right
and weren't. Here is why that happened, and why splitting it into three
specialized agents behind a router fixed most of it.

## The problem: three domains, one agent

Internal teams were spending too much time looking up information by hand
across three unrelated areas. Support agents needed past customer cases.
Content editors needed historical match data. Everyone needed internal policy
documentation.

These domains have different data, different users, and different tolerance
for error. A slightly wrong match statistic means a correction on the site. A
slightly wrong policy answer is worse.

## Why the monolithic agent broke down

We started with one agent, one retrieval pipeline, and one pool of documents.
It's the obvious first design and a fine place to start. The trouble showed up
once real queries hit it.

Retrieval crossed domains. A question about a refund policy could pull in
support-case chunks that mentioned refunds, and the model blended both into
one confident answer.

One prompt also had to serve everyone. Instructions that suited editors (be
descriptive, add match context) were wrong for policy questions, where you
want the text quoted, not paraphrased.

And failures were hard to debug. When an answer was wrong, I couldn't tell
whether retrieval, the prompt, or the model was at fault, because all three
were shared across every domain.

## The architecture we moved to

Each domain now has its own agent, with a prompt tuned for that domain. It
also has its own retrieval pipeline, and its own vector store namespace in
Pinecone, so one domain's documents can't leak into another's results.

In front of them sits a router built with LangGraph. It classifies each
incoming query and hands it to the right agent. The agents never see each
other's data.

```text
            user query
                |
        [ LangGraph router ]
        /        |         \
  support    match data    policy
   agent       agent        agent
     |           |            |
  namespace   namespace    namespace
  (Pinecone)  (Pinecone)   (Pinecone)
```

LangGraph fit because the routing logic is an explicit graph instead of
something buried in a prompt. You can read it, test it, and change one edge
without touching the rest.

## What changed

Moving from the monolith to specialized agents significantly reduced
hallucination rates and improved response accuracy across all three domains.
The reasons are fairly mundane. With a namespace per domain, the retriever
only searches content that could plausibly answer the question. Each agent has
one job, so its instructions can be specific instead of a compromise. And a
bad answer now points at one agent and one namespace, so fixes stay small.

## Running it in production

The system runs on AWS and is monitored with LangSmith. Tracing matters more
here than with a single agent. You need to see which route a query took, what
each agent retrieved, and where the answer went wrong. Without that, a router
is just one more place for bugs to hide.

## What I'd tell you before you build one

Start with one agent. A monolith is a good way to learn what your queries look
like. Split when you can name the domains and see them interfering with each
other.

Split along data and behavior, not org charts. If two domains don't differ in
content, retrieval needs, or tone, separating them only adds complexity.

Test the router harder than anything else. A misrouted query can't be saved by
a good agent, so keep an evaluation set of real queries with their expected
routes.

Isolate the data, not just the prompts. Separate namespaces did more for
answer quality than prompt tuning did.

Set up tracing early. You'll need it the first time an answer is wrong and you
have to explain why.

The stack was LangChain, LangGraph, Python, AWS, Pinecone, and LangSmith.

If you're building a RAG system or deploying agents and want a second opinion
on the architecture, you can [book a call](https://calendly.com/elbeqqal-youssef/new-meeting).
