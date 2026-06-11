export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const classes = {
    sm: "text-base",
    md: "text-2xl",
    lg: "text-5xl",
  }[size];

  return (
    <span
      className={`${classes} font-black italic tracking-tighter no-select whitespace-nowrap`}
    >
      🗿 ÉGOL<span className="text-aura">+</span>AURA
    </span>
  );
}
