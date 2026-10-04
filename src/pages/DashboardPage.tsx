import { useState, useEffect } from 'react';
import { MapPin, Scale, FileText, Clock, ArrowRight, Users, TrendingUp, Calendar, Globe, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Card, StatusBadge } from '@/components/ui';
import { Logo } from '@/components/Logo';
import { CropBadge } from '@/components/CropIcon';
import { PROCUREMENTS, FARMER } from '@/data/mockData';
import { LANGUAGES } from '@/translations';
import { supabase, type Farmer } from '@/lib/supabase';
import type { StageId } from '@/data/mockData';
import type { Page } from '@/App';

const DB_TO_STAGE: Record<string, StageId> = {
  registered: 'registered',
  verified: 'scheduled',
  slot_booked: 'scheduled',
  arrived: 'arrived',
  procured: 'weighed',
  payment_sent: 'accepted',
  payment_received: 'payment',
};

export function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t, lang, setLang } = useLanguage();
  const [dbFarmer, setDbFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    async function fetchLatest() {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        setDbError(true);
      } else if (data) {
        setDbFarmer(data as Farmer);
      }
      setLoading(false);
    }
    fetchLatest();
  }, []);

  const procurement = PROCUREMENTS[0];
  const currentLangMeta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const farmerName = dbFarmer?.name ?? FARMER.name[lang];
  const farmerToken = dbFarmer?.token ?? FARMER.token;
  const farmerLocation = dbFarmer
    ? [dbFarmer.village, dbFarmer.district, dbFarmer.state].filter(Boolean).join(', ')
    : FARMER.location[lang];
  const farmerStage: StageId = dbFarmer?.status
    ? (DB_TO_STAGE[dbFarmer.status] ?? 'registered')
    : procurement.currentStage;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600 mr-3" />
        <span className="text-earth-500 font-medium">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      {dbError && (
        <div className="mb-4 p-3 rounded-xl bg-saffron-50 text-saffron-700 border border-saffron-100 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {t('saveError')}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Logo size={56} className="shrink-0" />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
                {FARMER.greeting[lang]}, {farmerName}
              </h1>
              <div className="flex items-center gap-1.5 text-earth-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {farmerLocation}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 border border-earth-200/60 flex items-center gap-2">
            <span className="text-sm text-earth-500">{t('token')}</span>
            <span className="text-lg font-bold text-forest-700">#{farmerToken}</span>
          </div>
        </div>
      </div>

      {/* Your Language section */}
      <Card className="p-4 mb-6 bg-forest-50 border-forest-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-forest-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-forest-800">{t('yourLanguage')}</div>
              <div className="text-sm text-earth-500">{currentLangMeta.nativeLabel} ({currentLangMeta.label})</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  lang === l.code
                    ? 'bg-forest-700 text-white'
                    : 'bg-white text-earth-600 border border-earth-200 hover:bg-forest-100'
                }`}
              >
                {l.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main procurement status card */}
      <Card className="p-5 sm:p-7 mb-6 border-forest-200/50">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-forest-900">{t('procurementStatus')}</h2>
          <StatusBadge variant="active" label={t('active')} pulse />
        </div>

        {/* Procurement details */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <DetailItem icon={Scale} label={t('produce')} value={<CropBadge crop={procurement.crop} lang={lang} />} />
          <DetailItem icon={FileText} label={t('lotId')} value={procurement.lotId} />
          <DetailItem icon={MapPin} label={t('center')} value={procurement.center} />
        </div>

        {/* Progress tracker - the centerpiece */}
        <div className="bg-cream-50 rounded-2xl p-4 sm:p-6 border border-cream-200/60">
          <ProgressTracker currentStage={farmerStage} />
        </div>

        {/* Status note + next step */}
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 bg-leaf-50 rounded-xl p-4 border border-leaf-100">
            <div className="w-9 h-9 rounded-lg bg-leaf-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-leaf-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-leaf-700">
                {t('whatJustHappened')}
              </div>
              <p className="text-sm text-forest-800 mt-0.5">
                {procurement.statusNote[lang]}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-saffron-50 rounded-xl p-4 border border-saffron-100">
            <div className="w-9 h-9 rounded-lg bg-saffron-100 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-saffron-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-saffron-700">
                {t('nextStep')}
              </div>
              <p className="text-sm text-forest-800 mt-0.5">
                {procurement.nextStep[lang]}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('journey')}
          className="btn-primary w-full sm:w-auto mt-5 group"
        >
          {t('viewJourney')}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
        </button>
      </Card>

      {/* Current Situation card */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-forest-900 mb-4">{t('currentSituation')}</h2>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-leaf-600" />
            </div>
            <p className="text-forest-800 font-semibold">{t('situationNormal')}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SituationStat
              icon={Users}
              label={t('queuePosition')}
              value="7"
              sub={t('farmersAhead')}
              color="forest"
            />
            <SituationStat
              icon={Clock}
              label={t('estimatedWait')}
              value="35–50"
              sub={t('min')}
              color="saffron"
            />
            <SituationStat
              icon={MapPin}
              label={t('centerStatus')}
              value={t('active')}
              sub={t('openNow')}
              color="leaf"
            />
            <SituationStat
              icon={Clock}
              label={t('expectedProcessing')}
              value="2–3"
              sub={t('hours')}
              color="forest"
            />
          </div>
        </Card>
      </div>

      {/* Other procurements */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-forest-900 mb-4">
          {t('otherProcurements')}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROCUREMENTS.map((p) => (
            <Card
              key={p.id}
              className="p-4 hover:shadow-md transition-shadow"
              onClick={() => onNavigate('journey')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-forest-100 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-forest-700" />
                  </div>
                  <div>
                    <div className="font-bold text-forest-900">
                      <CropBadge crop={p.crop} lang={lang} />
                    </div>
                    <div className="text-xs text-earth-500">{p.lotId}</div>
                  </div>
                </div>
                <StatusBadge
                  variant={p.currentStage === 'scheduled' ? 'pending' : 'active'}
                  label={p.statusNote[lang].split('.')[0]}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-earth-500">
                <MapPin className="w-4 h-4" />
                {p.center}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-forest-700" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-earth-500 font-medium">{label}</div>
        <div className="font-bold text-forest-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function SituationStat({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  sub: string;
  color: 'forest' | 'leaf' | 'saffron';
}) {
  const colors = {
    forest: 'bg-forest-100 text-forest-700',
    leaf: 'bg-leaf-100 text-leaf-700',
    saffron: 'bg-saffron-100 text-saffron-700',
  };
  return (
    <div className="text-center sm:text-left">
      <div className={`inline-flex sm:flex w-10 h-10 rounded-xl items-center justify-center mb-2 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-earth-500 font-medium">{label}</div>
      <div className="text-xl font-bold text-forest-900">{value}</div>
      <div className="text-xs text-earth-400">{sub}</div>
    </div>
  );
}
