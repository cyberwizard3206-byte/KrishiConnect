import { useState } from 'react';
import { Calendar, MapPin, Clock, Filter, Wheat } from 'lucide-react';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';
import { Card, StatusBadge } from '@/components/ui';
import { SCHEDULE, type ScheduleItem } from '@/data/mockData';
import type { Language } from '@/translations';

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function dateSortValue(date: string): number {
  const [mon, day] = date.split(' ');
  return (MONTHS[mon] ?? 0) * 100 + parseInt(day, 10);
}

const SCHEDULE_SORTED = [...SCHEDULE].sort((a, b) => dateSortValue(a.date) - dateSortValue(b.date));

const statusVariantMap = {
  open: 'open',
  limited: 'limited',
  full: 'full',
  completed: 'completed',
} as const;

export function SchedulePage() {
  const { t, lang } = useLanguage();
  const [cropFilter, setCropFilter] = useState('all');
  const [centerFilter, setCenterFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const crops = Array.from(new Set(SCHEDULE_SORTED.map((s) => s.crop.en)));
  const centers = Array.from(new Set(SCHEDULE_SORTED.map((s) => s.center.en)));
  const dates = Array.from(new Set(SCHEDULE_SORTED.map((s) => s.date))).sort((a, b) => dateSortValue(a) - dateSortValue(b));

  const filtered = SCHEDULE_SORTED.filter((s) => {
    const cropMatch = cropFilter === 'all' || s.crop.en === cropFilter;
    const centerMatch = centerFilter === 'all' || s.center.en === centerFilter;
    const dateMatch = dateFilter === 'all' || s.date === dateFilter;
    return cropMatch && centerMatch && dateMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-forest-700" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('scheduleTitle')}
          </h1>
        </div>
        <p className="text-earth-500 text-sm">{t('scheduleSubtitle')}</p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-earth-500">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">{t('filters')}</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <SelectFilter
            label={t('filterCrop')}
            value={cropFilter}
            onChange={setCropFilter}
            allLabel={t('allCrops')}
            options={crops}
          />
          <SelectFilter
            label={t('filterCenter')}
            value={centerFilter}
            onChange={setCenterFilter}
            allLabel={t('allCenters')}
            options={centers}
          />
          <SelectFilter
            label={t('filterDate')}
            value={dateFilter}
            onChange={setDateFilter}
            allLabel={t('allDates')}
            options={dates}
          />
        </div>
      </Card>

      {/* Schedule list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-earth-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t('noSchedule')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <ScheduleCard key={item.id} item={item} index={i} lang={lang} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function SelectFilter({
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-earth-500 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input cursor-pointer"
      >
        <option value="all">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

const statusLabelKey: Record<ScheduleItem['status'], TranslationKey> = {
  open: 'statusOpen',
  limited: 'statusLimited',
  full: 'statusFull',
  completed: 'statusCompleted',
};

function ScheduleCard({
  item,
  index,
  lang,
  t,
}: {
  item: ScheduleItem;
  index: number;
  lang: Language;
  t: (key: TranslationKey) => string;
}) {
  const status = item.status;
  const variant = statusVariantMap[status];

  return (
    <Card
      className="p-4 sm:p-5 hover:shadow-md transition-shadow animate-fade-up"
      // @ts-expect-error inline style for delay
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-4 flex-wrap">
        {/* Date block */}
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-forest-50 border border-forest-100 shrink-0">
          <span className="text-xs font-semibold text-forest-600">
            {item.dayName[lang]}
          </span>
          <span className="text-lg font-bold text-forest-900 leading-none mt-0.5">
            {item.date.split(' ')[1]}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Wheat className="w-4 h-4 text-saffron-500" />
            <span className="font-bold text-forest-900">
              {item.crop[lang]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-earth-500 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{item.center[lang]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-earth-500 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.timeWindow[lang]}</span>
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0">
          <StatusBadge
            variant={variant}
            label={t(statusLabelKey[status])}
            pulse={status === 'open'}
          />
        </div>
      </div>
    </Card>
  );
}
