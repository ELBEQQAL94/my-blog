import { LINKEDIN_URL, SITE_NAME } from "@/lib/site";

export type Author = {
  name: string;
  avatar: string;
  linkedin?: string;
};

const AUTHORS: Record<string, Author> = {
  [SITE_NAME]: {
    name: SITE_NAME,
    avatar: "/author/youssef-elbeqqal.webp",
    linkedin: LINKEDIN_URL,
  },
};

const FALLBACK_AVATAR = "/avatar.webp";

export function getAuthor(name: string): Author {
  return AUTHORS[name] ?? { name, avatar: FALLBACK_AVATAR };
}
