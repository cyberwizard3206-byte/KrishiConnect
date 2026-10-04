import { Home, LayoutDashboard, User, HelpCircle, UserPlus, Users, Settings, LogOut, type LucideIcon } from 'lucide-react';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Logo } from './Logo';
import type { Page } from '@/App';

interface NavItem {
  id: Page;
  icon: LucideIcon;
}

const farmerNavItems: NavItem[] = [
  { id: 'home', icon: Home },
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'profile', icon: User },
  { id: 'help', icon: HelpCircle },
];

const adminNavItems: NavItem[] = [
  { id: 'admin', icon: LayoutDashboard },
  { id: 'adminFarmers', icon: Users },
  { id: 'adminSettings', icon: Settings },
];

const farmerNavLabels: Record<Page, TranslationKey> = {
  auth: 'authLoginTitle',
  home: 'navHome',
  dashboard: 'navProcurement',
  profile: 'navProfile',
  help: 'navHelp',
  register: 'navRegister',
  schedule: 'navSchedule',
  centers: 'navCenters',
  alerts: 'navAlerts',
  journey: 'navProcurement',
  admin: 'navAdminDashboard',
  adminFarmers: 'navAdminFarmers',
  adminSettings: 'navAdminSettings',
};

const adminNavLabels: Record<Page, TranslationKey> = {
  auth: 'authLoginTitle',
  admin: 'navAdminDashboard',
  adminFarmers: 'navAdminFarmers',
  adminSettings: 'navAdminSettings',
  home: 'navHome',
  dashboard: 'navProcurement',
  profile: 'navProfile',
  help: 'navHelp',
  register: 'navRegister',
  schedule: 'navSchedule',
  centers: 'navCenters',
  alerts: 'navAlerts',
  journey: 'navProcurement',
};

export function Navigation({
  current,
  onNavigate,
  role,
  onSwitchRole,
  onSignOut,
}: {
  current: Page;
  onNavigate: (page: Page) => void;
  role: 'farmer' | 'admin';
  onSwitchRole: () => void;
  onSignOut: () => void;
}) {
  const { t } = useLanguage();
  const items = role === 'admin' ? adminNavItems : farmerNavItems;
  const labels = role === 'admin' ? adminNavLabels : farmerNavLabels;

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden sm:flex sticky top-0 z-40 bg-cream-50/80 backdrop-blur-md border-b border-earth-200/60">
        <div className="max-w-6xl mx-auto w-full px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate(role === 'admin' ? 'admin' : 'home')}
            className="flex items-center gap-2.5 group"
          >
            <Logo size={40} className="group-hover:scale-105 transition" />
            <div className="text-left">
              <span className="block font-display font-bold text-lg text-forest-900 leading-none">
                KrishiConnect
              </span>
              <span className="block text-[10px] text-earth-500 font-medium tracking-wide">
                {role === 'admin' ? t('adminMode') : t('farmerMode')}
              </span>
            </div>
          </button>

          <nav className="flex items-center gap-1">
            {items.map((item) => {
              const isActive = current === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition ${
                    isActive
                      ? 'bg-forest-700 text-white shadow-sm'
                      : 'text-forest-700 hover:bg-forest-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(labels[item.id])}
                </button>
              );
            })}
            <button
              onClick={onSwitchRole}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition text-saffron-600 hover:bg-saffron-50 border border-saffron-200"
            >
              <UserPlus className="w-4 h-4" />
              {role === 'admin' ? t('switchToFarmer') : t('switchToAdmin')}
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm text-earth-600 hover:bg-earth-100 transition"
            >
              <LogOut className="w-4 h-4" />
              {t('authSignOut')}
            </button>
          </nav>

          <LanguageToggle />
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="sm:hidden sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-earth-200/60">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate(role === 'admin' ? 'admin' : 'home')}
            className="flex items-center gap-2"
          >
            <Logo size={36} />
            <span className="font-display font-bold text-lg text-forest-900">KrishiConnect</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchRole}
              className="text-xs font-semibold text-saffron-600 bg-saffron-50 px-2.5 py-1.5 rounded-lg border border-saffron-200"
            >
              {role === 'admin' ? t('switchToFarmer') : t('switchToAdmin')}
            </button>
            <button
              onClick={onSignOut}
              aria-label={t('authSignOut')}
              className="p-2 rounded-lg text-earth-600 hover:bg-earth-100 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-earth-200/60 pb-safe">
        <div className="flex items-center justify-around px-2 py-1.5">
          {items.map((item) => {
            const isActive = current === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition ${
                  isActive ? 'text-forest-700' : 'text-earth-400'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition ${
                    isActive ? 'bg-forest-100' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold">
                  {t(labels[item.id])}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
