import { useEffect, useState } from 'react';
import {
  FileCheck,
  CalendarCheck,
  Tractor,
  Scale,
  CheckCircle,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { STAGES, type StageId } from '@/data/mockData';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';

const iconMap: Record<string, LucideIcon> = {
  FileCheck,
  CalendarCheck,
  Tractor,
  Scale,
  CheckCircle,
  Wallet,
};

export function ProgressTracker({ currentStage }: { currentStage: StageId }) {
  const { t } = useLanguage();
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const [animatedIndex, setAnimatedIndex] = useState(-1);

  useEffect(() => {
    setAnimatedIndex(-1);
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setAnimatedIndex(i), i * 150)
    );
    return () => timers.forEach(clearTimeout);
  }, [currentStage]);

  return (
    <div className="w-full">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center justify-between gap-1">
        {STAGES.map((stage, i) => {
          const Icon = iconMap[stage.icon];
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;
          const isAnimated = i <= animatedIndex;

          return (
            <div key={stage.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 transition-colors duration-500 ${
                    i < currentIndex ? 'bg-forest-500' : 'bg-earth-200'
                  }`}
                />
              )}
              {/* Circle */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                } ${
                  isComplete
                    ? 'bg-forest-600 text-white'
                    : isCurrent
                    ? 'bg-forest-600 text-white ring-4 ring-forest-200 animate-pulse-ring'
                    : 'bg-cream-100 text-earth-400 border-2 border-earth-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {/* Label */}
              <span
                className={`mt-2 text-xs font-semibold text-center transition-opacity duration-500 ${
                  isAnimated ? 'opacity-100' : 'opacity-0'
                } ${isCurrent ? 'text-forest-800' : isComplete ? 'text-forest-600' : 'text-earth-500'}`}
              >
                {t(stage.labelKey as TranslationKey)}
              </span>
              {isCurrent && (
                <span className="text-[10px] text-saffron-600 font-bold mt-0.5">
                  {t('youAreHere')}
                </span>
              )}
              {isFuture && <span className="text-[10px] text-earth-400 mt-0.5">—</span>}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden flex flex-col gap-0">
        {STAGES.map((stage, i) => {
          const Icon = iconMap[stage.icon];
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isAnimated = i <= animatedIndex;

          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  } ${
                    isComplete
                      ? 'bg-forest-600 text-white'
                      : isCurrent
                      ? 'bg-forest-600 text-white ring-4 ring-forest-200'
                      : 'bg-cream-100 text-earth-400 border-2 border-earth-200'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`w-0.5 h-8 ${i < currentIndex ? 'bg-forest-500' : 'bg-earth-200'}`} />
                )}
              </div>
              <div className="pb-2 flex-1">
                <span
                  className={`text-sm font-semibold ${
                    isCurrent ? 'text-forest-800' : isComplete ? 'text-forest-600' : 'text-earth-500'
                  }`}
                >
                  {t(stage.labelKey as TranslationKey)}
                </span>
                {isCurrent && (
                  <span className="block text-xs text-saffron-600 font-bold">
                    {t('youAreHere')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
