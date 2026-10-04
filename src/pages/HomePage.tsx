import {
  ArrowRight,
  CalendarCheck,
  Route,
  Clock,
  Sprout,
  MapPin,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Page } from '@/App';

export function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: CalendarCheck,
      title: t('benefit1Title'),
      desc: t('benefit1Desc'),
    },
    {
      icon: Route,
      title: t('benefit2Title'),
      desc: t('benefit2Desc'),
    },
    {
      icon: Clock,
      title: t('benefit3Title'),
      desc: t('benefit3Desc'),
    },
  ];

  const journeySteps = [
    { icon: MapPin, label: t('whereToGo'), desc: t('findCenters') },
    { icon: CalendarCheck, label: t('whenToGo'), desc: t('checkSchedule') },
    { icon: TrendingUp, label: t('whatHappening'), desc: t('trackStatus') },
    { icon: Bell, label: t('whatNext'), desc: t('getNotified') },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-50 via-cream-50 to-leaf-50" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #2c6230 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Sprout className="w-4 h-4" />
                {t('heroBadge')}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="mt-5 text-lg text-earth-600 leading-relaxed max-w-xl">
                {t('heroSubtitle')}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-primary text-base px-6 py-3.5 group"
                >
                  {t('ctaCheckStatus')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </button>
                <button
                  onClick={() => onNavigate('centers')}
                  className="btn-secondary text-base px-6 py-3.5"
                >
                  <MapPin className="w-5 h-5" />
                  {t('ctaFindCenter')}
                </button>
              </div>

              {/* Stats */}
              <div className="mt-10 flex gap-8">
                <div>
                  <div className="text-2xl font-bold text-forest-800">6</div>
                  <div className="text-sm text-earth-500">
                    {t('procSteps')}
                  </div>
                </div>
                <div className="border-l border-earth-200 pl-8">
                  <div className="text-2xl font-bold text-forest-800">4</div>
                  <div className="text-sm text-earth-500">
                    {t('nearbyCenters')}
                  </div>
                </div>
                <div className="border-l border-earth-200 pl-8">
                  <div className="text-2xl font-bold text-forest-800">24h</div>
                  <div className="text-sm text-earth-500">
                    {t('paymentTracking')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: phone mockup */}
            <div className="relative animate-scale-in">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="card p-6 hover:shadow-md transition-shadow animate-fade-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-forest-700" />
                </div>
                <h3 className="text-lg font-bold text-forest-900 mb-2">{b.title}</h3>
                <p className="text-earth-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Journey preview */}
      <section className="bg-forest-50 border-y border-forest-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-forest-600 font-semibold text-sm mb-2">
              <Route className="w-4 h-4" />
              {t('procurementJourney')}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
              {t('journeySectionTitle')}
            </h2>
            <p className="text-earth-600 mt-3 max-w-2xl mx-auto">
              {t('journeySectionDesc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            {journeySteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-forest-100 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                >
                  <Icon className="w-7 h-7 text-forest-600 mb-3" />
                  <h4 className="font-bold text-forest-900">{item.label}</h4>
                  <p className="text-sm text-earth-500 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-primary px-6 py-3.5 group"
            >
              {t('startJourney')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PhoneMockup() {
  const { t, lang } = useLanguage();
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Phone frame */}
      <div className="relative bg-forest-900 rounded-[2.5rem] p-3 shadow-2xl shadow-forest-900/20">
        <div className="bg-cream-50 rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-forest-700 px-5 py-3 flex items-center justify-between">
            <span className="text-cream-50 text-xs font-semibold">
              {t('goodMorning')}, {lang === 'en' ? 'Ramesh' : 'रमेश'}
            </span>
            <span className="text-cream-100 text-xs">{lang === 'en' ? 'Jaipur' : 'जयपुर'}</span>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="bg-white rounded-xl p-3 border border-earth-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-forest-800">
                  {lang === 'en' ? 'Wheat · WS-28491' : 'गेहूं · WS-28491'}
                </span>
                <span className="text-[10px] bg-leaf-100 text-leaf-700 px-2 py-0.5 rounded-full font-semibold">
                  {t('weighed')}
                </span>
              </div>
              {/* Mini progress */}
              <div className="flex items-center gap-1">
                {[true, true, true, true, false, false].map((done, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full ${done ? 'bg-forest-500' : 'bg-earth-200'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[8px] text-earth-400 font-medium">
                <span>{t('stageRegistered')}</span>
                <span>{t('stagePayment')}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-earth-200/60">
              <div className="text-[10px] text-earth-500 font-semibold mb-1">
                {t('currentSituation')}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-xs font-bold text-forest-800">
                    {t('queuePosition')}: 7
                  </div>
                  <div className="text-[10px] text-earth-500">
                    35–50 {t('min')}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-leaf-100 flex items-center justify-center">
                  <span className="text-leaf-600 font-bold text-xs">7</span>
                </div>
              </div>
            </div>

            <div className="bg-saffron-50 rounded-xl p-3 border border-saffron-100">
              <div className="text-[10px] text-saffron-700 font-semibold">
                {t('nextStep')}: {t('statusPending')}
              </div>
            </div>
          </div>
        </div>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-forest-900 rounded-b-2xl" />
      </div>

      {/* Floating badges */}
      <div className="absolute -left-4 top-1/3 bg-white rounded-xl shadow-lg p-3 border border-earth-200/60 animate-fade-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-leaf-100 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4 text-leaf-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-forest-800">{t('stageScheduled')}</div>
            <div className="text-[10px] text-earth-500">{lang === 'en' ? 'Tomorrow 9 AM' : 'कल सुबह 9:00'}</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 bottom-1/4 bg-white rounded-xl shadow-lg p-3 border border-earth-200/60 animate-fade-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center">
            <Bell className="w-4 h-4 text-saffron-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-forest-800">{t('navAlerts')}</div>
            <div className="text-[10px] text-earth-500">{lang === 'en' ? 'Payment sent' : 'भुगतान शुरू'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
