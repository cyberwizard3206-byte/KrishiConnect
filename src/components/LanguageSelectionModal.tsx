import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGES } from '@/translations';
import { Logo } from './Logo';

export function LanguageSelectionModal() {
  const { hasChosen, lang, setLang, t } = useLanguage();

  if (hasChosen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-forest-900/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-cream-50 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={64} className="mb-4" />
          <h1 className="font-display text-2xl font-bold text-forest-900">{t('brandName')}</h1>
          <p className="text-earth-500 text-sm mt-1">{t('brandTagline')}</p>
        </div>

        <h2 className="text-lg font-bold text-forest-800 text-center mb-1">{t('chooseLanguage')}</h2>
        <p className="text-sm text-earth-500 text-center mb-5">{t('languagePrompt')}</p>

        <div className="grid grid-cols-2 gap-2.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-pressed={lang === l.code}
              className={`flex flex-col items-center justify-center gap-1 bg-white border rounded-xl py-4 px-3 hover:border-forest-500 hover:bg-forest-50 transition group ${
                lang === l.code ? 'border-forest-600 ring-2 ring-forest-200' : 'border-earth-200'
              }`}
            >
              <span className="text-lg font-bold text-forest-800 group-hover:text-forest-900">
                {l.nativeLabel}
              </span>
              <span className="text-xs text-earth-400">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
