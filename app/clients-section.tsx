"use client";

import {
  ScaleIcon,
  ShieldIcon,
  ShoppingBagIcon,
} from "@/components/client-icons";
import { useInView } from "./use-in-view";

const clients = [
  {
    name: "Arsenal FC",
    summary: "Digital platform serving millions of fans worldwide",
    icon: ShieldIcon,
    iconBg: "bg-red-100 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "WIPO",
    summary: "UN agency, cross-platform IP tooling",
    icon: ScaleIcon,
    iconBg: "bg-blue-100 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "HSE",
    summary: "Home Shopping Europe, e-commerce microservices at scale",
    icon: ShoppingBagIcon,
    iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export function ClientsSection() {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {clients.map((client, index) => (
        <div
          key={client.name}
          className={`flex items-start gap-3 rounded-lg border border-zinc-200 p-4 transition-all duration-500 ease-out dark:border-zinc-800 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${client.iconBg}`}
          >
            <client.icon className={`h-5 w-5 ${client.iconColor}`} />
          </div>
          <div>
            <p className="font-semibold tracking-tight">{client.name}</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {client.summary}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
