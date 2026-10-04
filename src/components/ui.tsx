import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type Variant = 'open' | 'limited' | 'full' | 'completed' | 'active' | 'pending' | 'delayed' | 'closed';

const variants: Record<Variant, { bg: string; text: string; dot: string }> = {
  open: { bg: 'bg-leaf-100', text: 'text-leaf-700', dot: 'bg-leaf-500' },
  limited: { bg: 'bg-saffron-100', text: 'text-saffron-700', dot: 'bg-saffron-500' },
  full: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  completed: { bg: 'bg-earth-100', text: 'text-earth-600', dot: 'bg-earth-400' },
  active: { bg: 'bg-leaf-100', text: 'text-leaf-700', dot: 'bg-leaf-500' },
  pending: { bg: 'bg-cream-200', text: 'text-earth-600', dot: 'bg-earth-400' },
  delayed: { bg: 'bg-saffron-100', text: 'text-saffron-700', dot: 'bg-saffron-500' },
  closed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export function StatusBadge({
  variant,
  label,
  icon: Icon,
  pulse,
}: {
  variant: Variant;
  label: string;
  icon?: LucideIcon;
  pulse?: boolean;
}) {
  const v = variants[variant];
  return (
    <span className={`badge ${v.bg} ${v.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-forest-700" />
          </div>
        )}
        <h2 className="text-xl font-bold text-forest-900">{title}</h2>
      </div>
      {subtitle && <p className="text-earth-600 mt-1 ml-11">{subtitle}</p>}
    </div>
  );
}
