import {
  Ticket,
  Tractor,
  Scale,
  FlaskConical,
  CheckCircle,
  Wallet,
  Clock,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { TIMELINE, type TimelineEvent } from '@/data/mockData';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';

const iconMap: Record<string, LucideIcon> = {
  Ticket,
  Tractor,
  Scale,
  FlaskConical,
  CheckCircle,
  Wallet,
};

const statusConfig: Record<
  TimelineEvent['status'],
  { bg: string; ring: string; text: string; labelKey: TranslationKey; icon: LucideIcon }
> = {
  completed: {
    bg: 'bg-forest-600',
    ring: 'bg-forest-100',
    text: 'text-forest-700',
    labelKey: 'statusCompleted',
    icon: CheckCircle,
  },
  active: {
    bg: 'bg-forest-600',
    ring: 'bg-forest-100',
    text: 'text-forest-700',
    labelKey: 'statusActive',
    icon: Clock,
  },
  pending: {
    bg: 'bg-cream-300',
    ring: 'bg-cream-100',
    text: 'text-earth-600',
    labelKey: 'statusPending',
    icon: Clock,
  },
  delayed: {
    bg: 'bg-saffron-500',
    ring: 'bg-saffron-100',
    text: 'text-saffron-700',
    labelKey: 'statusDelayed',
    icon: AlertTriangle,
  },
};

export function Timeline() {
  const { lang, t } = useLanguage();

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-earth-200" />

      <div className="space-y-6">
        {TIMELINE.map((event, i) => {
          const cfg = statusConfig[event.status];
          const Icon = iconMap[event.icon] ?? CheckCircle;
          const isLast = i === TIMELINE.length - 1;

          return (
            <div
              key={event.id}
              className="relative flex gap-4 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Icon circle */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  event.status === 'pending' ? 'bg-cream-200' : cfg.bg
                } ${event.status === 'active' ? 'ring-4 ring-forest-200 animate-pulse-ring' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 ${event.status === 'pending' ? 'text-earth-500' : 'text-white'}`}
                />
              </div>

              {/* Content */}
              <div className={`flex-1 ${isLast ? '' : 'pb-2'}`}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h3 className="font-bold text-forest-900">
                    {event.label[lang]}
                  </h3>
                  <span
                    className={`text-sm font-semibold ${
                      event.status === 'pending' ? 'text-earth-500' : 'text-forest-600'
                    }`}
                  >
                    {event.time}
                  </span>
                </div>
                <p className="text-earth-600 text-sm mt-1">
                  {event.description[lang]}
                </p>
                <span
                  className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold ${cfg.text}`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.bg}`} />
                  {t(cfg.labelKey)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
