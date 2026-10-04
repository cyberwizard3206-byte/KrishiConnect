import { useState, type FormEvent } from 'react';
import { ArrowRight, Leaf, LockKeyhole, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export function AuthPage({
  onAuthenticated,
  initialError,
}: {
  onAuthenticated: () => void;
  initialError: string;
}) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          onAuthenticated();
        } else {
          setNotice(t('authEmailConfirmation'));
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onAuthenticated();
      }
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : t('authUnknownError');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode() {
    setMode((current) => current === 'login' ? 'signup' : 'login');
    setError('');
    setNotice('');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-forest-950 via-forest-800 to-forest-700 px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-leaf-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-saffron-300/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Logo size={48} className="rounded-xl bg-white p-1" />
            <div>
              <p className="font-display text-lg font-bold leading-tight">{t('brandName')}</p>
              <p className="text-xs text-white/70">{t('brandSubtitle')}</p>
            </div>
          </div>
          <LanguageToggle />
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <section className="hidden text-white lg:block">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-leaf-100">
              <Leaf className="h-4 w-4" />
              {t('heroBadge')}
            </div>
            <h1 className="max-w-xl font-display text-5xl font-bold leading-tight">
              {t('brandTagline')}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              {t('heroSubtitle')}
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-white/70">
              <span className="h-px w-10 bg-saffron-300" />
              {t('authSecureAccess')}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-3xl bg-cream-50 p-6 shadow-2xl sm:p-9">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100">
                <Logo size={44} />
              </div>
              <h2 className="font-display text-2xl font-bold text-forest-900">
                {mode === 'login' ? t('authLoginTitle') : t('authSignupTitle')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-earth-600">
                {mode === 'login' ? t('authLoginDescription') : t('authSignupDescription')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-earth-700">{t('authFullName')}</span>
                  <input
                    className="input"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={100}
                    placeholder={t('authNamePlaceholder')}
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-earth-700">{t('authEmail')}</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
                  <input
                    className="input pl-10"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    maxLength={254}
                    placeholder={t('authEmailPlaceholder')}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-earth-700">{t('authPassword')}</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
                  <input
                    className="input pl-10"
                    type="password"
                    name="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    placeholder={t('authPasswordPlaceholder')}
                  />
                </span>
                {mode === 'signup' && (
                  <span className="mt-1.5 block text-xs text-earth-500">{t('authPasswordHint')}</span>
                )}
              </label>

              {(error || initialError) && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error || initialError}
                </p>
              )}
              {notice && (
                <p role="status" className="rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">
                  {notice}
                </p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                {isSubmitting
                  ? t('authPleaseWait')
                  : mode === 'login' ? t('authLoginButton') : t('authSignupButton')}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-earth-600">
              {mode === 'login' ? t('authNoAccount') : t('authHaveAccount')}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-bold text-forest-700 underline-offset-4 hover:underline"
              >
                {mode === 'login' ? t('authCreateAccount') : t('authGoToLogin')}
              </button>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
