import Image from "next/image";
import { getAuthor } from "@/lib/authors";

export function AuthorByline({
  author,
  date,
  linkable = false,
}: {
  author: string;
  date?: string;
  /** Links the name to the author's LinkedIn. Only use where this isn't already nested inside a <Link> (e.g. a post card), since nested anchors are invalid HTML. */
  linkable?: boolean;
}) {
  const { name, avatar, linkedin } = getAuthor(author);

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Image src={avatar} alt={name} fill className="object-cover" sizes="32px" />
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {linkable && linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
          >
            {name}
          </a>
        ) : (
          <span className="text-zinc-700 dark:text-zinc-300">{name}</span>
        )}
        {date && (
          <>
            {" "}
            · <time dateTime={date}>{date}</time>
          </>
        )}
      </p>
    </div>
  );
}
