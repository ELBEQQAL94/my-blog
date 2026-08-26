"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkedInIcon, XIcon } from "@/components/social-icons";
import { LINKEDIN_URL, X_URL } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

type Section = "about" | "contact" | null;

function useActiveSection(enabled: boolean): Section {
  const [activeSection, setActiveSection] = useState<Section>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSection(null);
      return;
    }

    const ids: Exclude<Section, null>[] = ["about", "contact"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as Section);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return activeSection;
}

function navLinkClass(active: boolean) {
  return active
    ? "text-sm font-semibold text-zinc-900 dark:text-zinc-100"
    : "text-sm text-zinc-600 hover:underline dark:text-zinc-300";
}

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBlogActive = pathname.startsWith("/blog");
  const activeSection = useActiveSection(isHome);

  return (
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
      <Link
        href="/#about"
        aria-current={activeSection === "about" ? "location" : undefined}
        className={navLinkClass(isHome && activeSection === "about")}
      >
        About
      </Link>
      <Link
        href="/blog"
        aria-current={isBlogActive ? "page" : undefined}
        className={navLinkClass(isBlogActive)}
      >
        Blog
      </Link>
      <Link
        href="/#contact"
        aria-current={activeSection === "contact" ? "location" : undefined}
        className={navLinkClass(isHome && activeSection === "contact")}
      >
        Contact
      </Link>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <LinkedInIcon className="h-4 w-4" />
      </a>
      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <XIcon className="h-4 w-4" />
      </a>
      <ThemeToggle />
    </nav>
  );
}
