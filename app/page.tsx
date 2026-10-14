import Image from "next/image";
import Link from "next/link";
import { CALENDLY_URL, LINKEDIN_URL, X_URL } from "@/lib/site";
import { ExperienceTimeline } from "./experience-timeline";

const experience = [
  {
    company: "NTT DATA",
    role: "Technical Lead, Arsenal FC Platform",
    dates: "Mar 2025 - Present",
    summary:
      "Leading full-stack delivery of a globally recognised sports platform serving millions of fans, from architecture through CI/CD.",
  },
  {
    company: "NTT DATA",
    role: "AI Engineer, Automation CoE",
    dates: "Jul 2024 - Feb 2025",
    summary:
      "Built production RAG pipelines and LLM-orchestrated chatbots using OpenAI and Claude, backed by Flask/Python APIs.",
  },
  {
    company: "NTT DATA",
    role: "Sr. Full Stack Engineer, WIPO Sequence Tool",
    dates: "Jun 2023 - Jun 2024",
    summary:
      "Built a cross-platform desktop and web application with Electron.js, Angular, and a Spring Boot backend.",
  },
  {
    company: "iMedia24 GmbH",
    role: "Sr. Full Stack Engineer, HSE Home Shopping Europe",
    dates: "Nov 2022 - May 2023",
    summary:
      "Built a solvency microservice in Kotlin/Vert.x on AWS CDK, and led a frontend migration to React.",
  },
  {
    company: "Skylark Services",
    role: "Full Stack Developer",
    dates: "Sep 2020 - Oct 2022",
    summary:
      "Delivered full-stack applications with React, Next.js, React Native, and Spring Boot.",
  },
];

const skillGroups = [
  {
    label: "Frontend & TypeScript",
    skills: ["Angular", "RxJS", "TypeScript", "React", "React Native", "Next.js"],
  },
  {
    label: "Cloud & DevOps",
    skills: ["AWS CDK", "AWS", "Azure", "Docker", "GitHub Actions", "Kubernetes", "Terraform"],
  },
  {
    label: "Backend & AI",
    skills: [
      "Node.js",
      "Python / FastAPI",
      "Spring Boot",
      "GraphQL / REST",
      "LangChain / RAG",
      "OpenAI / Claude",
      "VectorDB",
    ],
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-20 px-6 py-16">
      <section className="flex flex-col gap-4">
        <Image
          src="/avatar.webp"
          alt="Youssef El Beqqal"
          width={72}
          height={72}
          className="rounded-full"
          priority
        />
        <h1 className="text-3xl font-semibold tracking-tight">
          Youssef El Beqqal
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          I help companies ship production AI systems: RAG pipelines,
          multi-agent architectures, and LLM workflows that actually work at
          scale.
        </p>
        <p className="text-zinc-500 dark:text-zinc-400">
          I lead engineering teams building enterprise AI systems and
          high-traffic platforms serving millions of users. Based in Rabat,
          Morocco, working remote.
        </p>
      </section>

      <section id="work-with-me" className="flex scroll-mt-28 flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Work with me
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300">
          I&apos;m available for fractional AI engineering engagements and
          project-based work with US and European companies. If you&apos;re
          building a RAG system, deploying AI agents, or integrating LLMs into
          your product and need a senior engineer who has done this in
          production, let&apos;s talk.
        </p>
        <div className="flex justify-center">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Book a 20-minute call
          </a>
        </div>
      </section>

      <section id="about" className="flex scroll-mt-28 flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          About
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300">
          I&apos;m a Tech Lead with 7+ years building enterprise AI systems
          and high-traffic platforms at global scale. I currently lead
          technical delivery for a globally recognised sports platform
          serving millions of fans, and previously built production AI agent
          systems, including RAG pipelines, LLM-orchestrated chatbots, and
          automation workflows, for enterprise clients. I care about clean
          architecture, systems that hold up in production, and turning
          messy business requirements into things that actually work.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Experience
        </h2>
        <ExperienceTimeline items={experience} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Case Study
        </h2>
        <h3 className="text-lg font-semibold tracking-tight">
          Multi-agent RAG system for a global sports platform
        </h3>
        <p className="text-zinc-600 dark:text-zinc-300">
          Arsenal FC&apos;s internal teams were spending too much time manually
          retrieving information across three separate business domains:
          customer support cases, historical match data for content editors,
          and internal policy documentation.
        </p>
        <p className="text-zinc-600 dark:text-zinc-300">
          I designed and built a multi-agent RAG architecture where each
          domain has its own dedicated agent, retrieval pipeline, and vector
          store namespace. A central router directs queries to the correct
          agent using LangGraph. I moved the system from an initial monolithic
          agent design to this specialized architecture, which significantly
          reduced hallucination rates and improved response accuracy across
          all three domains. The system is deployed on AWS and monitored in
          production using LangSmith.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "LangChain",
            "LangGraph",
            "Python",
            "AWS",
            "Pinecone",
            "LangSmith",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Skills
        </h2>
        <div className="flex flex-col gap-4">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {group.label}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="flex scroll-mt-28 flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Contact
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            Book a call
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            X (Twitter)
          </a>
          <Link href="/blog" className="font-medium hover:underline">
            Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
