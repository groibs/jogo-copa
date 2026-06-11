export function AuraSphere({
  size,
  className = "",
}: {
  size: number;
  className?: string;
}) {
  return (
    <div
      className={`aura-sphere shrink-0 no-select ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
