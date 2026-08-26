"use client";

import { useInView } from "./use-in-view";

export type ExperienceItem = {
  company: string;
  role: string;
  dates: string;
  summary: string;
};

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="relative">
      <div
        className={`absolute left-1.5 top-0 h-full w-px origin-top bg-zinc-300 transition-transform duration-700 ease-out dark:bg-zinc-700 ${
          isVisible ? "scale-y-100" : "scale-y-0"
        }`}
      />
      <ul className="flex flex-col gap-6">
        {items.map((job, index) => (
          <li key={`${job.company}-${job.role}`} className="relative pl-8">
            <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            <div
              className={`transition-all duration-500 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-semibold tracking-tight">
                  {job.role} · {job.company}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {job.dates}
                </p>
              </div>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
