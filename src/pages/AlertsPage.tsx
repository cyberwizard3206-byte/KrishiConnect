import { useState } from 'react';
import { Bell, Calendar, Users, CheckCircle, Wallet, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { ALERTS, type Alert } from '@/data/mockData';

const typeConfig = {
  reminder: { icon: Calendar, bg: 'bg-forest-100', text: 'text-forest-700', ring: 'ring-forest-200' },
  queue: { icon: Users, bg: 'bg-saffron-100', text: 'text-saffron-700', ring: 'ring-saffron-200' },
  status: { icon: CheckCircle, bg: 'bg-leaf-100', text: 'text-leaf-700', ring: 'ring-leaf-200' },
  payment: { icon: Wallet, bg: 'bg-cream-200', text: 'text-forest-700', ring: 'ring-cream-300' },
};

export function AlertsPage() {
  const { t, lang } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-forest-700" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
              {t('alertsTitle')}
            </h1>
            {unreadCount > 0 && (
              <span className="bg-saffron-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-earth-500 text-sm">{t('alertsSubtitle')}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-ghost text-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {t('markAllRead')}
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-16 text-earth-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t('noAlerts')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const cfg = typeConfig[alert.type];
            const Icon = cfg.icon;

            return (
              <Card
                key={alert.id}
                className={`p-4 sm:p-5 animate-fade-up transition-all ${
                  alert.read ? 'opacity-70' : ''
                }`}
                // @ts-expect-error inline style
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${cfg.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-forest-900">
                        {alert.title[lang] ?? alert.title.en}
                      </h3>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-saffron-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-earth-600 mt-1 leading-relaxed">
                      {alert.message[lang] ?? alert.message.en}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-earth-400">
                        {alert.time[lang] ?? alert.time.en}
                      </span>
                      {!alert.read && (
                        <button
                          onClick={() => markRead(alert.id)}
                          className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {t('markRead')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
