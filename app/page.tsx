import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, LINKEDIN_URL, X_URL } from "@/lib/site";
import { ClientsSection } from "./clients-section";
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
          Tech Lead · Full Stack Engineer · AI Engineer
        </p>
        <p className="text-zinc-500 dark:text-zinc-400">
          I lead engineering teams building enterprise AI systems and
          high-traffic platforms serving millions of users. Based in Rabat,
          Morocco, working remote.
        </p>
      </section>

      <section id="about" className="flex scroll-mt-28 flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          About
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300">
          I&apos;m a Tech Lead with 5+ years building enterprise AI systems
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

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Clients
        </h2>
        <ClientsSection />
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
        <p className="text-zinc-600 dark:text-zinc-300">
          Open to Tech Lead and AI Engineering opportunities.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium hover:underline"
          >
            {CONTACT_EMAIL}
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
