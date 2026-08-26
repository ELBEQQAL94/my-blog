import { getAllPosts } from "@/lib/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  const postLines = posts
    .map((post) => `- ${post.title}: ${SITE_URL}/blog/${post.slug} - ${post.description}`)
    .join("\n");

  const body = `# ${SITE_NAME}

## Summary
Youssef El Beqqal is a Tech Lead, Full Stack Engineer, and AI Engineer based in Rabat, Morocco. He has 5+ years of experience delivering enterprise AI systems and high-traffic platforms, currently leading technical delivery for a globally recognised sports platform serving millions of fans.

## Key Resources
- Homepage: ${SITE_URL}
- Writing (blog): ${SITE_URL}/blog
- RSS feed: ${SITE_URL}/rss.xml
- LinkedIn: https://linkedin.com/in/youssef-el-beqqal-640b6917a
- X (Twitter): https://x.com/YBeqqal
- Contact: elbeqqal.youssef@gmail.com

## Bio
Youssef leads engineering teams building enterprise AI systems and high-traffic platforms at global scale. His work spans RAG pipelines, LLM-orchestrated chatbots, automation workflows, and full-stack web/mobile delivery for enterprise clients, including a globally recognised sports platform, a UN agency, and large-scale e-commerce.

## Skills
Frontend & TypeScript: Angular, RxJS, TypeScript, React, React Native, Next.js
Cloud & DevOps: AWS CDK, AWS, Azure, Docker, GitHub Actions, Kubernetes, Terraform
Backend & AI: Node.js, Python/FastAPI, Spring Boot, GraphQL/REST, LangChain/RAG, OpenAI/Claude, VectorDB

## Recent Writing
${postLines}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
