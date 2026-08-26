type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.2 7 9 4.1-1.8 7-4.8 7-9V6l-7-2.5Z" />
      <path d="M9 12.5 11 14.5 15 10" />
    </svg>
  );
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3v18" />
      <path d="M7 7h10" />
      <path d="M4 7 2 12a3 3 0 0 0 3.5 2.4A3 3 0 0 0 8 12L6 7" />
      <path d="M20 7l-2 5a3 3 0 0 0 3.5 2.4A3 3 0 0 0 24 12l-2-5" />
      <path d="M9 21h6" />
    </svg>
  );
}

export function ShoppingBagIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
