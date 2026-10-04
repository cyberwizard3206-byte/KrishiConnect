import { useState } from 'react';
import { Search, MapPin, Users, Clock, Navigation, Wheat, Sprout } from 'lucide-react';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';
import { Card, StatusBadge } from '@/components/ui';
import { CENTERS, type Center } from '@/data/mockData';
import type { Language } from '@/translations';

const statusVariantMap = {
  open: 'open' as const,
  limited: 'limited' as const,
  closed: 'closed' as const,
};

const statusLabelKey: Record<Center['status'], TranslationKey> = {
  open: 'openNow',
  limited: 'limitedCapacity',
  closed: 'closedToday',
};

export function CentersPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = CENTERS.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.en.toLowerCase().includes(q) ||
      c.crops.some((crop) => crop.en.toLowerCase().includes(q)) ||
      c.address.en.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-forest-700" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('centersTitle')}
          </h1>
        </div>
        <p className="text-earth-500 text-sm">{t('centersSubtitle')}</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="input pl-12 text-base"
        />
      </div>

      {/* Map placeholder */}
      <Card className="mb-6 overflow-hidden">
        <div
          className="relative h-48 sm:h-64 bg-forest-50"
          style={{
            backgroundImage:
              'linear-gradient(0deg, #f0f7f0 1px, transparent 1px), linear-gradient(90deg, #f0f7f0 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          {/* Roads */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-cream-200 -translate-y-1/2" />
          <div className="absolute left-1/3 top-0 bottom-0 w-3 bg-cream-200" />
          <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-cream-100" />

          {/* Center pins */}
          {CENTERS.slice(0, 4).map((c, i) => {
            const positions = [
              { top: '30%', left: '25%' },
              { top: '60%', left: '55%' },
              { top: '40%', left: '75%' },
              { top: '75%', left: '20%' },
            ];
            const pos = positions[i];
            const color =
              c.status === 'open'
                ? 'bg-forest-600'
                : c.status === 'limited'
                ? 'bg-saffron-500'
                : 'bg-red-500';
            return (
              <div
                key={c.id}
                className="absolute -translate-x-1/2 -translate-y-full group cursor-pointer"
                style={pos}
              >
                <div className={`w-7 h-7 ${color} rounded-full ring-4 ring-white shadow-lg flex items-center justify-center`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className={`w-2 h-2 ${color} rounded-full mx-auto -mt-0.5`} />
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-md text-xs font-semibold text-forest-800 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {c.name[lang]}
                </div>
              </div>
            );
          })}

          {/* User location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-100 animate-pulse" />
          </div>

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-earth-600 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            {t('mapPlaceholder')}
          </div>
        </div>
      </Card>

      {/* Center cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-earth-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>{t('noCenters')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((center, i) => (
            <CenterCard key={center.id} center={center} index={i} lang={lang} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function CenterCard({
  center,
  index,
  lang,
  t,
}: {
  center: Center;
  index: number;
  lang: Language;
  t: (key: TranslationKey) => string;
}) {
  const variant = statusVariantMap[center.status];

  return (
    <Card
      className="p-5 hover:shadow-md transition-shadow animate-fade-up"
      // @ts-expect-error inline style
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <h3 className="font-bold text-forest-900 leading-tight">
              {center.name[lang]}
            </h3>
            <p className="text-xs text-earth-500 mt-0.5">
              {center.address[lang]}
            </p>
          </div>
        </div>
        <StatusBadge variant={variant} label={t(statusLabelKey[center.status])} pulse={center.status === 'open'} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-earth-400" />
          <div>
            <div className="text-xs text-earth-400">{t('distance')}</div>
            <div className="font-semibold text-forest-800">
              {center.distance[lang]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-earth-400" />
          <div>
            <div className="text-xs text-earth-400">{t('estimatedWait')}</div>
            <div className="font-semibold text-forest-800">
              {center.waitTime[lang]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-earth-400" />
          <div>
            <div className="text-xs text-earth-400">{t('queueLength')}</div>
            <div className="font-semibold text-forest-800">
              {center.queue} {t('farmers')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wheat className="w-4 h-4 text-earth-400" />
          <div>
            <div className="text-xs text-earth-400">{t('cropsAccepted')}</div>
            <div className="font-semibold text-forest-800">
              {center.crops.map((c) => c[lang]).join(', ')}
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={center.status === 'closed'}
        className="btn-secondary w-full disabled:opacity-40"
      >
        <Navigation className="w-4 h-4" />
        {t('getDirections')}
      </button>
    </Card>
  );
}
