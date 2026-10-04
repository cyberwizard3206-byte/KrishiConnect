export function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/app-logo.png"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      alt="KrishiConnect"
    />
  );
}
