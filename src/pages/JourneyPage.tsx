import { ArrowLeft, Route, Scale, FileText, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Timeline } from '@/components/Timeline';
import { Card, StatusBadge } from '@/components/ui';
import { PROCUREMENTS, FARMER } from '@/data/mockData';
import { CropBadge } from '@/components/CropIcon';
import type { Page } from '@/App';

export function JourneyPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t, lang } = useLanguage();
  const procurement = PROCUREMENTS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="btn-ghost mb-4 -ml-2 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToDashboard')}
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Route className="w-5 h-5 text-forest-700" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('journeyTitle')}
          </h1>
        </div>
        <p className="text-earth-500 text-sm">{t('journeySubtitle')}</p>
      </div>

      {/* Procurement summary card */}
      <Card className="p-5 mb-6 border-forest-200/50">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-forest-700 flex items-center justify-center">
              <Scale className="w-6 h-6 text-cream-50" />
            </div>
            <div>
              <h2 className="font-bold text-forest-900 text-lg">
                <CropBadge crop={procurement.crop} lang={lang} /> · {procurement.lotId}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-earth-500">
                <MapPin className="w-3.5 h-3.5" />
                {procurement.center}
              </div>
            </div>
          </div>
          <StatusBadge variant="active" label={t('weighed')} pulse />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-earth-100">
          <div>
            <div className="text-xs text-earth-500">{t('quantity')}</div>
            <div className="font-bold text-forest-900">{procurement.quantity}</div>
          </div>
          <div>
            <div className="text-xs text-earth-500">{t('token')}</div>
            <div className="font-bold text-forest-900">#{FARMER.token}</div>
          </div>
          <div>
            <div className="text-xs text-earth-500">{t('updated')}</div>
            <div className="font-bold text-forest-900 capitalize">
              {procurement.updatedAt}
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-forest-700" />
          <h2 className="font-bold text-forest-900 text-lg">
            {t('detailedTimeline')}
          </h2>
        </div>
        <Timeline />
      </Card>

      {/* Help note */}
      <div className="mt-6 bg-cream-100 rounded-2xl p-4 border border-cream-200/60 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center shrink-0">
          <Route className="w-5 h-5 text-forest-700" />
        </div>
        <div>
          <p className="text-sm text-forest-800 font-semibold">
            {t('whatHappensNext')}
          </p>
          <p className="text-sm text-earth-600 mt-1">
            {t('whatHappensNextDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
