import { useEffect, useState } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Logo } from '@/components/Logo';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SchedulePage } from '@/pages/SchedulePage';
import { CentersPage } from '@/pages/CentersPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { JourneyPage } from '@/pages/JourneyPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { HelpPage } from '@/pages/HelpPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AuthPage } from '@/pages/AuthPage';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export type Page =
  | 'auth'
  | 'home'
  | 'dashboard'
  | 'register'
  | 'schedule'
  | 'centers'
  | 'alerts'
  | 'journey'
  | 'profile'
  | 'help'
  | 'admin'
  | 'adminFarmers'
  | 'adminSettings';

const ADMIN_PAGES: Page[] = ['admin', 'adminFarmers', 'adminSettings'];

function AppContent() {
  const [page, setPage] = useState<Page>('auth');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const { t } = useLanguage();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authenticated = Boolean(session);
      setIsAuthenticated(authenticated);
      setIsCheckingSession(false);
      if (authenticated) setPage((current) => current === 'auth' ? 'home' : current);
      else setPage('auth');
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Unable to restore the authentication session:', error);
        setAuthError(t('authSessionError'));
      } else if (data.session) {
        setIsAuthenticated(true);
        setPage('home');
      }
      setIsCheckingSession(false);
    }).catch((error: unknown) => {
      console.error('Unable to restore the authentication session:', error);
      setAuthError(t('authSessionError'));
      setIsCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [t]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = () => {
    if (role === 'farmer') {
      setRole('admin');
      navigate('admin');
    } else {
      setRole('farmer');
      navigate('home');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthError('');
      setRole('farmer');
      setPage('auth');
    } catch (error) {
      console.error('Unable to sign out:', error);
      setAuthError(error instanceof Error ? error.message : t('authUnknownError'));
    }
  };

  const isAdminPage = ADMIN_PAGES.includes(page);
  const effectiveRole = isAdminPage ? 'admin' : role;

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50" role="status">
        <span className="text-sm font-semibold text-forest-700">{t('loading')}</span>
      </div>
    );
  }

  if (!isAuthenticated || page === 'auth') {
    return (
      <AuthPage
        onAuthenticated={() => {
          setAuthError('');
          setIsAuthenticated(true);
          setPage('home');
        }}
        initialError={authError}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-cream-50">
        <Navigation
          current={page}
          onNavigate={navigate}
          role={effectiveRole}
          onSwitchRole={switchRole}
          onSignOut={signOut}
        />
        {authError && (
          <p role="alert" className="bg-red-50 px-4 py-2 text-center text-sm text-red-800">
            {authError}
          </p>
        )}
        <main>
          {page === 'home' && <HomePage onNavigate={navigate} />}
          {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
          {page === 'register' && <RegisterPage onNavigate={navigate} />}
          {page === 'schedule' && <SchedulePage />}
          {page === 'centers' && <CentersPage />}
          {page === 'alerts' && <AlertsPage />}
          {page === 'journey' && <JourneyPage onNavigate={navigate} />}
          {page === 'profile' && <ProfilePage onNavigate={navigate} />}
          {page === 'help' && <HelpPage />}
          {page === 'admin' && <AdminDashboardPage onNavigate={navigate} />}
          {page === 'adminFarmers' && <AdminDashboardPage onNavigate={navigate} initialTab="farmers" />}
          {page === 'adminSettings' && <AdminDashboardPage onNavigate={navigate} initialTab="settings" />}
        </main>

        {/* Footer */}
        <footer className="hidden sm:block border-t border-earth-200/60 bg-cream-100">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-earth-500 text-sm">
              <Logo size={24} />
              <span className="font-display font-bold text-forest-800">KrishiConnect</span>
              <span>·</span>
              <span>{t('brandSubtitle')}</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
